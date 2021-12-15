require 'securerandom'

class CallExecuteStatement < ApplicationJob
  queue_as :default

  def perform(query, note, option={})
    execute_export(
      db_user: query.client_account.redshift_user,
      query_stmt: query.select_stmt,
      option: option,
      note: note,
      job_id: query.job_id,
      timestamp_prefix: query.timestamp_prefix,
      logger: Rails.logger
    )
  rescue => err
    QueryError.create(job_id: query.job_id, message: "#{err.class.to_s}: #{err.message}")
    raise err
  end

  def execute_export(db_user:, query_stmt:, option:, note:, job_id:, timestamp_prefix:, logger:)
    execution = DataApiQueryExecution.new(job_id, timestamp_prefix)

    manifest = option[:enable_metadata] || false
    unload_query = SafeUnloadQuery.wrap(query: query_stmt, manifest: manifest, bundle: execution.bundle, note: note)
    stmt = unload_query.to_sql
    logger.info "[SQL/Redshift] /* #{unload_query.sanitized_note}*/ #{query_stmt}"

    config = RedshiftBase::connection_db_config.configuration_hash
    logger.info "[Redshift Data API] execute statement: #{job_id} by #{db_user}"
    api_response = Aws::RedshiftDataAPIService::Client.new.execute_statement({
      cluster_identifier: config[:cluster_identifier],
      database: config[:database],
      db_user: db_user,
      sql: stmt,
      statement_name: "queuery: #{unload_query.sanitized_note}",
      with_event: true
    })
    logger.info "[Redshift Data API] Execute Response: #{api_response}"
    api_response
  end

  class SafeUnloadQuery < RedshiftConnector::UnloadQuery
    def self.wrap(query:, manifest:, bundle:, note:)
      new(query: RedshiftConnector::ArbitraryQuery.new(query), manifest: manifest, bundle: bundle, note: note)
    end

    def initialize(query:, manifest:, bundle:, note:)
      @query = query
      @manifest = manifest
      @bundle = bundle
      @note = note
    end

    def to_sql
      # $tag_name$ is dollar quoting.
      # https://www.postgresql.jp/document/8.0/html/sql-syntax.html
      doller_quoting = "$t#{SecureRandom.alphanumeric}$"

      <<-EndSQL.gsub(/^\s+/, '')
        -- #{sanitized_note}
        unload (#{doller_quoting} #{@query.to_sql} #{doller_quoting})
        to '#{@bundle.url}'
        credentials '#{@bundle.credential_string}'
        gzip
        allowoverwrite
        delimiter ',' escape addquotes
        #{manifest_option}
      EndSQL
    end

    def sanitized_note
      @note.to_s.gsub(/\r\n|\r|\n/, ' ')
    end

    def manifest_option
      @manifest ? 'manifest verbose' : ''
    end
  end
end

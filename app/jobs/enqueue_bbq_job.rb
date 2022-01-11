class EnqueueBbqJob < ApplicationJob
  queue_as (ENV['QUEUERY_BBQ_QUEUE'] || :default).to_sym

  def perform(query_id, note, timestamp_prefix, client_account, option={})
    execute_export(
      db_user: client_account.redshift_user,
      query: Query.find(query_id),
      option: option,
      note: note,
      job_id: job_id,
      timestamp_prefix: timestamp_prefix,
      logger: Rails.logger
    )
  rescue => err
    QueryError.create(job_id: job_id, message: "#{err.class.to_s}: #{err.message}")
    raise err
  end

  def execute_export(db_user:, query:, option:, note:, job_id:, timestamp_prefix:, logger:)
    execution = DataApiQueryExecution.new(job_id, timestamp_prefix)

    manifest = option[:enable_metadata] || false
    unload_query = SafeUnloadQuery.wrap(query: query.select_stmt, manifest: manifest, bundle: execution.bundle, note: note)
    stmt = unload_query.to_sql
    logger.info "[SQL/Redshift] /* #{unload_query.sanitized_note}*/ #{query.select_stmt}"

    config = RedshiftBase::connection_db_config.configuration_hash
    logger.info "[Redshift Data API] execute statement: #{job_id} by #{db_user}"

    api_response = with_retry do
      Aws::RedshiftDataAPIService::Client.new.execute_statement({
        cluster_identifier: config[:cluster_identifier],
        database: config[:database],
        db_user: db_user,
        sql: stmt,
        statement_name: "queuery: #{unload_query.sanitized_note}",
        with_event: true
      })
    end

    logger.info "[Redshift Data API] Execute Response: #{api_response}"
    query.data_api_id = api_response.id
    query.save!
  end

  private def with_retry(max_retry: 5, max_backoff: 8)
    count = 0
    begin
      count += 1
      yield
    rescue Seahorse::Client::NetworkingError, Aws::RedshiftDataAPIService::Errors::InternalFailure
      raise if count > max_retry
      sleep [2 ** (count - 1), max_backoff].min
      logger.info "[Redshift Data API] Retry ExecuteStatement: #{count} time"
      retry
    end
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

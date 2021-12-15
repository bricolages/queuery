require 'timeout'
require 'aws-sdk-s3'

class Query < ApplicationRecord
  belongs_to :client_account
  # FIXME: associated by job_id...
  has_one :query_error, foreign_key: :job_id, primary_key: :job_id

  SUCCESS_STATUS = ['FINISHED']
  ERROR_STATUS = ['FAILED', 'ABORTED']
  ENDED_STATUS = SUCCESS_STATUS + ERROR_STATUS

  def self.execute(unbound_select_stmt, values, unload_option, client_account)
    bound_select_stmt = bind_sql_parameters(unbound_select_stmt, values, client_account)
    new(select_stmt: bound_select_stmt, client_account: client_account).tap {|q| q.execute(unload_option: unload_option)}
  end

  def self.bind_sql_parameters(statement, values, client_account)
    statement = tmp_fix_sql_statement(statement, client_account)
    value_list = values.dup
    conn = self.connection
    replace_sql_parameters(statement) { conn.quote(value_list.shift) }
  end

  def self.replace_sql_parameters(statement)
    escaped = []
    escaped_statement = statement.gsub(%r{--.*?$|/\*.*?\*/|'(?:[^']+|'')'}m) {|matched|
      escaped.push(matched)
      "\0"
    }
    replaced_statement = escaped_statement.gsub('?') { yield }
    replaced_statement.gsub("\0") { escaped.shift }
  end

  # FIXME: this is temporary fix, fix implements at all clients and then remove this.
  def self.tmp_fix_sql_statement(stmt, client_account)
    if stmt.include?('%%')
      Rails.logger.warn "SQL statement includes %%: account=#{client_account.name}"
    end
    stmt.gsub('%%', '%')
  end

  def execute(unload_option: {})
    note = "queried by #{client_account.name}"
    self.timestamp_prefix = generate_timestamp_prefix
    self.job_id = generate_job_id # alternative bbq job_id

    api_response =  CallExecuteStatement.perform_now(self, note, unload_option)

    self.data_api_id = api_response.id
    save!
  end

  def generate_timestamp_prefix(timestamp = Time.now)
    timestamp.strftime("%Y/%m/%d/%Y%m%d_%H%M_")
  end

  def generate_job_id
    SecureRandom.uuid
  end

  def query_execution
    return nil if job_id.nil?
    @execution ||= DataApiQueryExecution.new(job_id, timestamp_prefix)
  end

  def status
    return data_api_status if ENDED_STATUS.include?(data_api_status)

    bucket = self.query_execution.bundle.bucket
    event_log_obj = bucket.object("states/#{data_api_id}.json")

    Rails.logger.info "[Redshift Data API] check status:#{data_api_id} to s3://#{bucket.name}/#{event_log_obj.key}"
    if event_log_obj.exists?
      event_log = event_log_obj.get.body
      state = event_log.detail.state
    else
      state = 'STARTED'
    end

    if ERROR_STATUS.include?(state)
      Rails.logger.info "[Redshift Data API] describe statement #{data_api_id}"
      api_response = Aws::RedshiftDataAPIService::Client.new.describe_statement({id: data_api_id})
      Rails.logger.info "[Redshift Data API] Describe Response: #{api_response}"
      QueryError.find_or_create_by(job_id: job_id, message: "#{api_response[:error]}") if api_response[:error]
    end

    self.data_api_status = state
    save!
    data_api_status
  end

  def to_resource
    QueryResource.new(self)
  end
end

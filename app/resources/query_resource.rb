class QueryResource
  include Garage::Representer

  property :id
  property :status
  property :data_file_urls
  property :manifest_file_url, selectable: true
  property :error
  property :select_stmt, selectable: true
  property :created_at, selectable: true
  property :barbeque_url, selectable: true # TODO: Remove
  property :job_id, selectable: true
  property :client_account_name, selectable: true
  property :s3_prefix, selectable: true

  delegate :id, :select_stmt, :created_at, :job_id, to: :@model
  delegate :data_file_urls, :manifest_file_url, to: :'@query_execution'

  def status
    case @model.status
      when 'SUBMITTED' then
        'pending'
      when 'STARTED', 'PICKED' then
        'running'
      when 'FINISHED' then
        'success'
      when 'FAILED' then
        'failed'
      when 'ABORTED' then
        'failed'
      else
        'unknown'
      end
  end

  def client_account_name
    @model.client_account.name
  end

  def error
    @model.query_error&.message
  end

  def s3_prefix
    @model.query_execution&.bundle.url
  end

  def initialize(model)
    @model = model
    @query_execution = @model.query_execution
  end
end

class DataApiQueryExecution
  attr_reader :job_id, :timestamp

  def initialize(job_id, timestamp_prefix)
    @job_id = job_id
    @timestamp_prefix = timestamp_prefix
  end

  def prefix
    "#{@timestamp_prefix}job_#{@job_id}/result.csv."
  end

  def bundle
    RedshiftConnector::S3DataFileBundle.for_prefix(prefix: prefix, format: :redshift_csv)
  end

  # for compatibility with client calls, TODO REMOVE
  def barbeque_url
    ''
  end

  def data_file_urls
    r = RedshiftConnector::DataFileBundleReader.new(bundle)
    r.all_data_objects.reject {|o| o.key.include?('result.csv.manifest')}.map do |data_file|
      data_file.presigned_url(:get, expires_in: 6.hour.to_i)
    end
  end

  def manifest_file_url
    r = RedshiftConnector::DataFileBundleReader.new(bundle)
    manifest_file = r.all_data_objects.find {|o| o.key.include?('result.csv.manifest')}
    manifest_file&.presigned_url(:get, expires_in: 6.hour.to_i)
  end
end

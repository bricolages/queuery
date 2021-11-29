module RedshiftConnector
  S3Bucket.add(
    'queuery',
    bucket: ENV['QUEUERY_S3_BUCKET'],
    prefix: ENV['QUEUERY_PREFIX'] || 'results',
    iam_role: ENV['QUEUERY_S3_IAM'],
    default: true
  )
end

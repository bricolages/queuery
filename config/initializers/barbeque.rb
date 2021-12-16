BarbequeClient.configure do |config|
  config.endpoint = ENV.fetch('BARBEQUE_ENDPOINT', 'http://localhost:3003')
  if ENV['BARBEQUE_HEADER_HOST']
    config.headers = { 'Host' => ENV['BARBEQUE_HEADER_HOST'] }
  end

  if Rails.env.production?
    config.application   = ENV['QUEUERY_BBQ_APPLICATION'] || 'queuery'
  end
  if Rails.env.development?
    config.application   = 'queuery-staging'
  end
end

Rails.application.config.middleware.use OmniAuth::Builder do
  provider(
    :azure_oauth2,
    client_id: ENV.fetch('AAD_CLIENT_ID'),
    client_secret: ENV.fetch('AAD_CLIENT_SECRET'),
    tenant_id: ENV.fetch('AAD_TENANT_ID'),
  )
end

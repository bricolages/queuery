# Queuery uses static HTMLs, so CSRF token cannot be embeded to HTMLs.
OmniAuth.config.allowed_request_methods = [:get, :post]

Rails.application.configure do
  config.middleware.use OmniAuth::Builder do
    provider :openid_connect, {
      name: 'azure_ad',
      issuer: "https://login.microsoftonline.com/#{ENV.fetch('AAD_TENANT_ID')}/v2.0",
      discovery: true,
      scope: [:openid, :profile, :email],
      response_type: 'id_token',
      response_mode: 'form_post',
      client_options: {
        identifier: ENV.fetch('AAD_CLIENT_ID'),
        redirect_uri: ENV.fetch('AAD_REDIRECT_URI'),
      },
    }
  end
end

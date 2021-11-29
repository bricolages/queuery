class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Basic::ControllerMethods
  include Garage::ControllerHelper

  attr_reader :current_client_account

  def authenticate_client
    @current_client_account = authenticate_or_request_with_http_basic do |token, token_secret|
      ClientAccount.authenticate(token, token_secret)&.tap do |client_account|
        Raven.user_context(token: token, name: client_account.name)
      end
    end
  end

  rescue_from ApplicationError do |exception|
    response_error(exception)
  end

  rescue_from WeakParameters::ValidationError do
    raise InvalidParameterError
  end

  def response_error(application_error)
    render json: application_error.to_hash, status: application_error.status_code
  end
end

class V2::SessionsController < ApplicationController
  def create
    session[:email] = auth_hash.email
    redirect_to '/console/'
  end

  protected

  def auth_hash
    request.env['omniauth.auth'].info
  end
end

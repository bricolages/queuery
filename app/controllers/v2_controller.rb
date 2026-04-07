class V2Controller < ApplicationController
  before_action :authenticate!

  def current_user
    @current_user = session[:email]
  end

  def authenticate!
    if current_user.nil?
      head :unauthorized
    else
      current_user
    end
  end

  def check_redshift_user(user, password)
    config = RedshiftBase.connection_db_config.configuration_hash
    conn = PG::Connection.new(
      host: config[:host],
      port: config[:port],
      dbname: config[:database],
      user:,
      password:,
    )
    conn.close
  end
end

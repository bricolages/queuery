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

  def check_redshift_user(username, password)
    connection_config = RedshiftBase::connection_config.dup
    connection_config[:username] = username
    connection_config[:password] = password

    connection_pool = RedshiftBase.generate_temporary_ds.establish_connection(connection_config)
    res = connection_pool.connection.execute('select 1')
    connection_pool.disconnect!
  rescue PG::ConnectionBad => err
    raise err
  end
end

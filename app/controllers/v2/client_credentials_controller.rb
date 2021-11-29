class V2::ClientCredentialsController < V2Controller
  include RestfulActions

  validates :update do
    boolean :disabled, required: true, strong: true
  end

  def client_account
    @client_account ||= ClientAccount.find_by!(name: params[:client_account_name])
  end

  def create_resource
    name, redshift_user, redshift_password = params[:name], params[:redshift_user], params[:redshift_password]
    check_redshift_user(redshift_user, redshift_password)
    @resource = client_account.client_credentials.generate.to_resource
  end

  def require_resources
    @resources = client_account.client_credentials.order(:id).map(&:to_resource)
  end

  def require_resource
    @resource = ClientCredential.find_by!(token: params[:token]).to_resource
  end

  def update_resource
    @resource.update(permitted_params)
    @resource
  end

  def location
    { action: :show, token: @resource.token }
  end
end

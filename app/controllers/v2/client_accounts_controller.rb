class V2::ClientAccountsController < V2Controller
  include RestfulActions

  validates :create do
    string :name, required: true, strong: true
    string :redshift_user, required: true, strong: true
  end

  def require_resource
    @resource = ClientAccount.find_by!(name: params[:name]).to_resource
  end

  def require_resources
    @resources = ClientAccount.order(:id).map(&:to_resource)
  end

  def create_resource
    name, redshift_user, redshift_password = params[:name], params[:redshift_user], params[:redshift_password]
    check_redshift_user(redshift_user, redshift_password)
    @resource = ClientAccount.create(name: name, redshift_user: redshift_user).to_resource
  end

  def update_resource
    name, redshift_user, redshift_password = params[:name], params[:redshift_user], params[:redshift_password]
    check_redshift_user(redshift_user, redshift_password)
    @resource.update(name: name, redshift_user: redshift_user)
    @resource
  end

  def destroy_resource
    @resource.destroy!
  end

  def location
    { action: :show, name: @resource.name }
  end
end

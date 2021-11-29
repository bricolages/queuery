class V2::QueriesController < V2Controller
  include RestfulActions

  def queries_relation
    if params[:client_account_name].present?
      return ClientAccount.find_by(name: params[:client_account_name]).queries
    end
    Query.all.includes(:client_account)
  end

  # TODO: pagination
  def require_resources
    @resources = queries_relation.order(id: :desc).includes(:query_error)
  end

  def require_resource
    @resource = Query.find(params[:id]).to_resource
  end

  def respond_with_resources_options
    { paginate: true, max_per_page: 10 }
  end
end

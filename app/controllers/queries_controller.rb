class QueriesController < ApplicationController
  before_action :authenticate_client

  include RestfulActions

  validates :create do
    string :q, required: true, strong: true
    array :values, required: false, strong: true
    boolean :enable_metadata, required: false, strong: true
  end

  def require_resource
    @resource = current_client_account.queries.find(params[:id]).to_resource
  end

  def create_resource
    values = params.fetch(:values, [])
    unload_option = { enable_metadata: params.fetch(:enable_metadata, false) }
    @resource = Query.execute(params[:q], values, unload_option, current_client_account).to_resource
  end
end

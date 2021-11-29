module RestfulActions
  extend ActiveSupport::Concern
  include Garage::RestfulActions

  included do
    # Don't call `require_resources` on :create
    before_action :require_resources, only: :index
  end
end

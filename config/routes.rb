Rails.application.routes.draw do
  scope :v1, defaults: { format: :json } do
    resources :queries, only: [:create, :show]
  end

  scope :v2, module: 'v2', defaults: { format: :json } do
    resources :queries, only: :index
    resources :client_accounts, except: [:new, :edit], param: :name do
      resources :client_credentials, except: :destroy, param: :token, shallow: true

      resources :queries, only: [:index, :show], shallow: true
    end
  end

  get '/hello/revision' => RevisionPlate::App.new
  get '/auth/azure_oauth2/callback', to: 'v2/sessions#create'
end

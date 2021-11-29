class ClientAccount < ApplicationRecord
  include Garage::Representer

  has_many :queries, dependent: :destroy
  has_many :client_credentials, dependent: :destroy

  validates :name, format: { with: /\A[a-z_][a-z_0-9-]*\z/i }

  class << self
    def authenticate(token, token_secret)
      ClientCredential.authenticate(token, token_secret)&.client_account
    end
  end

  property :name
  property :redshift_user

  def to_param
    name
  end
end

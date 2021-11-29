class ClientCredential < ApplicationRecord
  include Garage::Representer

  belongs_to :client_account

  scope :enabled, -> { where(disabled: false) }

  class << self
    def authenticate(token, token_secret)
      enabled.find_by(token: token)&.authenticate(token_secret) || nil
    end

    def generate
      token = SecureRandom.urlsafe_base64(32)
      token_secret = SecureRandom.urlsafe_base64(64)
      create(token: token, token_secret: token_secret)
    end
  end

  attr_reader :token_secret

  def authenticate(raw_token_secret)
    BCrypt::Password.new(token_secret_digest).is_password?(raw_token_secret) && self
  end

  def token_secret=(raw_token_secret)
    @token_secret = raw_token_secret
    self.token_secret_digest = BCrypt::Password.create(raw_token_secret)
  end

  property :token
  property :token_secret
  property :disabled

  def to_param
    token
  end
end

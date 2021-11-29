class ApplicationError < StandardError
  def initialize(message = error)
    super
  end

  def to_hash
    { status_code: status_code, error_code: error_code, error: error }
  end

  def status_code
    self.class::STATUS_CODE
  end

  def error_code
    self.class::ERROR_CODE
  end

  def error
    self.class::MESSAGE
  end
end

class InvalidParameterError < ApplicationError
  STATUS_CODE = 400
  ERROR_CODE = 'invalid_parameter'
  MESSAGE = 'invalid parameters are given'
end

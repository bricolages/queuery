require 'securerandom'

class RedshiftBase < ActiveRecord::Base
  self.abstract_class = true

  establish_connection "#{Rails.env}_redshift".to_sym

  def self.generate_temporary_ds
    temp_ds_name = "TemporaryRedshiftDataSource#{SecureRandom.random_number(1_000_000)}"
    Rails.logger.info "temp_ds_name: #{temp_ds_name}"
    Object.const_set(temp_ds_name, Class.new(RedshiftBase))
  end
end

require 'securerandom'

desc "issue password for client"
task :token, [:client_name] => :environment do |task, args|
  client_account = ClientAccount.find_or_create_by!(name: args[:client_name])
  token = SecureRandom.urlsafe_base64(32)
  token_secret = SecureRandom.urlsafe_base64(64)
  client_account.client_credentials.create(token: token, token_secret: token_secret)

  puts "Token       : #{token}"
  puts "Token Secret: #{token_secret}"
end

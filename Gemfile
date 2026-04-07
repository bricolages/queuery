source 'https://rubygems.org'

gem 'rails', '~> 7.0.10'
gem 'pg'
gem 'puma'
gem 'bcrypt'

gem 'the_garage'
gem 'barbeque_client', '>= 0.10.2'
gem 'redshift_connector', git: 'https://github.com/bricolages/redshift_connector', ref: '2080d2f446448686e627df0f3939117c9d6ed454'
gem 'revision_plate', require: 'revision_plate/rails'
gem 'weak_parameters'
gem 'rack-rewrite'
gem 'rack-timeout'
gem 'kaminari'
gem 'sentry-ruby'
gem 'sentry-rails'
gem 'omniauth_openid_connect'
gem 'expeditor'
gem 'aws-sdk-redshift'
gem 'aws-sdk-redshiftdataapiservice'
gem 'silencer', require: 'silencer/rails/logger'

group :development, :test do
  gem 'test-unit'
end

group :development do
  gem 'listen'
  gem 'sinatra'
  gem 'foreman'
end

group :production, :staging do
  gem 'unicorn'
end

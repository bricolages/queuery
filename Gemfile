source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 6.1.4.1'
# Use postgresql as the database for Active Record
gem 'pg', '~> 1.2.3'
# Use Puma as the app server
gem 'puma', '~> 5.5'
# Use ActiveModel has_secure_password
gem 'bcrypt', '~> 3.1.7'

gem 'the_garage'
gem 'redshift_connector', '~> 8.0'
gem 'revision_plate', require: 'revision_plate/rails'
gem 'weak_parameters'
gem 'rack-rewrite'
gem 'kaminari'
gem 'sentry-raven'
gem 'omniauth-azure-oauth2'
gem 'expeditor'
gem 'aws-sdk-redshift'
gem 'aws-sdk-redshiftdataapiservice'
gem 'silencer'

group :development, :test do
  gem 'pry'
  gem 'pry-rails'
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platform: :mri
  gem 'test-unit'
end

group :development do
  gem 'listen', '~> 3.0.5'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'sinatra', '~> 2.1.0'
  gem 'foreman'
end

group :production, :staging do
  gem 'unicorn', '~> 5'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

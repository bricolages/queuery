# This file is used by Rack-based servers to start the application.

require 'rack-rewrite'

use Rack::Rewrite do
  r302   '/', '/console/'
  rewrite %r{^/console/[^.]*$}, '/console/index.html'
end

require_relative 'config/environment'

run Rails.application

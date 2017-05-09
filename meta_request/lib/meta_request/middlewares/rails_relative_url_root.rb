require 'active_support/core_ext/string/access'
require 'active_support/core_ext/object/blank'
module MetaRequest
  module Middlewares
    class RailsRelativeUrlRoot
      def initialize(app)
        @app = app
      end

      def call(env)
        middleware = Rack::ResponseHeaders.new(@app) do |headers|
          if ENV["RAILS_RELATIVE_URL_ROOT"].present?
            headers["X-Rails-Relative-Url-Root"] = ENV["RAILS_RELATIVE_URL_ROOT"] if ENV["RAILS_RELATIVE_URL_ROOT"].present?
          elsif
            headers["X-Rails-Relative-Url-Root"] = Rails.application.config.relative_url_root
          end
        end
        middleware.call(env)
      end
    end
  end
end

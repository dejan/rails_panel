require 'rack/contrib/response_headers'

module MetaRequest
  module Middlewares
    class Headers
      def initialize(app, app_config)
        @app = app
        @app_config = app_config
      end

      def call(env)
        request_path = env['PATH_INFO']
        middleware = Rack::ResponseHeaders.new(@app) do |headers|
          headers['X-Meta-Request-Version'] = MetaRequest::VERSION unless request_path.start_with?(assets_prefix)
        end
        middleware.call(env)
      end

      private
      def assets_prefix
        "/#{@app_config.assets.prefix[/\A\/?(.*?)\/?\z/, 1]}/"
      end

    end
  end
end

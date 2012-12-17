module MetaRequest
  module Middlewares
    class Interceptor
      def initialize(app)
        @app = app
      end

      def call(env)
        handler = MetaRequest::Handler.lookup(env["PATH_INFO"])
        handler.process(@app, env)
      end
    end
  end
end

module MetaRequest
  module Middlewares
    class AppRequestHandler
      def initialize(app)
        @app = app
      end

      def call(env)
        app_request = AppRequest.new env["action_dispatch.request_id"]
        app_request.current!
        @app.call(env)
      rescue Exception => exception
        wrapper = ActionDispatch::ExceptionWrapper.new(env, exception)
        app_request.events.push(*Event.events_for_exception(wrapper))
        raise
      ensure
        app_request.save
      end
    end
  end
end


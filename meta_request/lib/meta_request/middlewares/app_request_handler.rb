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
        if defined?(ActionDispatch::ExceptionWrapper)
          wrapper = ActionDispatch::ExceptionWrapper.new(env, exception)
          app_request.events.push(*Event.events_for_exception(wrapper))
        else
          app_request.events.push(*Event.events_for_exception(exception))
        end
        raise
      ensure
        Storage.new(app_request.id).write(app_request.events.to_json) unless app_request.events.empty?
      end
    end
  end
end


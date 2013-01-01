require 'rails/railtie'

module MetaRequest
  class Railtie < ::Rails::Railtie

    initializer 'meta_request.inject_middlewares' do |app|
      app.middleware.use Middlewares::RequestId unless defined?(ActionDispatch::RequestId)
      app.middleware.use Middlewares::MetaRequestHandler
      app.middleware.use Middlewares::Headers, app.config
      app.middleware.use Middlewares::AppRequestHandler
    end

    initializer 'meta_request.subscribe_to_notifications' do
      ActiveSupport::Notifications.subscribe do |*args|
        AppRequest.current.events << Event.new(*args) if AppRequest.current
      end
    end

  end
end



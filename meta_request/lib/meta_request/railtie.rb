require 'rails/railtie'

module MetaRequest
  class Railtie < ::Rails::Railtie

    initializer 'meta_request.inject_middlewares' do |app|
      app.middleware.use Middlewares::RequestId unless defined?(ActionDispatch::RequestId)
      app.middleware.use Middlewares::MetaRequestHandler
      app.middleware.use Middlewares::Headers, app.config
      app.middleware.use Middlewares::AppRequestHandler
    end

    initializer 'meta_request.log_interceptor' do
      Rails.logger.extend(LogInterceptor) if Rails.logger
    end

    initializer 'meta_request.subscribe_to_notifications' do
      AppNotifications.subscribe
    end

  end
end



# frozen_string_literal: true

require 'rails/railtie'
require 'meta_request/event'

module MetaRequest
  class Railtie < ::Rails::Railtie
    initializer 'meta_request.inject_middlewares' do |app|
      app.middleware.use Middlewares::MetaRequestHandler
      app.middleware.insert_before ActionDispatch::DebugExceptions, Middlewares::Headers, app.config
      app.middleware.use Middlewares::AppRequestHandler
    end

    initializer 'meta_request.log_interceptor' do
      Rails.logger&.extend(LogInterceptor)
    end

    initializer 'meta_request.subscribe_to_notifications' do
      MetaRequest::Event.subscribe_to_notifications
    end
  end
end

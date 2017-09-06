require 'rails/railtie'

module MetaRequest
  def self.initialize!(app)
    raise "MetaRequest initialized twice. Set `require: false' for meta_request in your Gemfile" if @already_initialized

    MetaRequest::inject_middlewares!(app)
    MetaRequest::initialize_log_interceptor!
    MetaRequest::subscribe_to_notifications!

    @already_initialized = true
  end

  def self.inject_middlewares!(app)
    raise "MetaRequest middlewares injected twice. Set `require: false' for meta_request in your Gemfile" if @injected_middlewares

    app.middleware.use Middlewares::RequestId unless defined?(ActionDispatch::RequestId)
    app.middleware.use Middlewares::MetaRequestHandler

    if defined? ActionDispatch::DebugExceptions
      app.middleware.insert_before ActionDispatch::DebugExceptions, Middlewares::Headers, app.config
    else
      app.middleware.use Middlewares::Headers, app.config
    end

    app.middleware.use Middlewares::AppRequestHandler

    @injected_middlewares = true
  end

  def self.initialize_log_interceptor!
    raise "MetaRequest log interceptor initialized twice. Set `require: false' for meta_request in your Gemfile" if @initialized_log_interceptor

    Rails.logger.extend(LogInterceptor) if Rails.logger

    @initialized_log_interceptor = true
  end

  def self.subscribe_to_notifications!
    raise "MetaRequest notifications subscribed twice. Set `require: false' for meta_request in your Gemfile" if @subscribed_to_notifications

    AppNotifications.subscribe

    @subscribed_to_notifications = true
  end

  class Railtie < ::Rails::Railtie
    initializer 'meta_request.inject_middlewares' do |app|
      MetaRequest::inject_middlewares!(app)
    end

    initializer 'meta_request.log_interceptor' do
      MetaRequest::initialize_log_interceptor!
    end

    initializer 'meta_request.subscribe_to_notifications' do
      MetaRequest::subscribe_to_notifications!
    end

  end
end



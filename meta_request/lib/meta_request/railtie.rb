require 'rack/contrib/response_headers'
require 'rails/railtie'

module MetaRequest
  class Railtie < ::Rails::Railtie

    initializer 'meta_request.inject_middlewares' do |app|
      app.middleware.use Rack::ResponseHeaders do |headers|
        headers['X-MetaRequest-Version'] = VERSION
      end
      app.middleware.use MetaRequest::Middlewares::Interceptor
    end

    initializer 'meta_request.subscribe_to_notifications' do
      MetaRequest::NotificationSubscriber.new
    end
  end
end



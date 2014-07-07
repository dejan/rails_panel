module MetaRequest
  autoload :VERSION,          "meta_request/version"
  autoload :Event,            "meta_request/event"
  autoload :AppRequest,       "meta_request/app_request"
  autoload :Storage,          "meta_request/storage"
  autoload :Middlewares,      "meta_request/middlewares"
  autoload :LogInterceptor,   "meta_request/log_interceptor"
  autoload :AppNotifications, "meta_request/app_notifications"

  def self.logger
    @@logger ||= Logger.new(File.join(Rails.root, 'log', 'meta_request.log'))
  end
end

require "meta_request/railtie"

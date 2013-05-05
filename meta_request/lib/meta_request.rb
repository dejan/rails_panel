module MetaRequest
  autoload :VERSION,        "meta_request/version"
  autoload :Event,          "meta_request/event"
  autoload :AppRequest,     "meta_request/app_request"
  autoload :Storage,        "meta_request/storage"
  autoload :Middlewares,    "meta_request/middlewares"
  autoload :LogInterceptor, "meta_request/log_interceptor"
end

require "meta_request/railtie"

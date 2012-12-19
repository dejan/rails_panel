module MetaRequest
  autoload :Version,     "meta_request/version"
  autoload :Event,       "meta_request/event.rb"
  autoload :AppRequest,  "meta_request/app_request"
  autoload :Middlewares, "meta_request/middlewares"
end

require "meta_request/railtie"

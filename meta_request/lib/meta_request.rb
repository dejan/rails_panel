module MetaRequest
  autoload :Version,                "meta_request/version"
  autoload :Event,                  "meta_request/event.rb"
  autoload :Transaction,            "meta_request/transaction"
  autoload :TransactionStorage,     "meta_request/transaction_storage"
  autoload :Handler,                "meta_request/handler"
  autoload :AppRequestHandler,      "meta_request/app_request_handler"
  autoload :MetaRequestHandler,     "meta_request/meta_request_handler"
  autoload :Middlewares,            "meta_request/middlewares"
  autoload :NotificationSubscriber, "meta_request/notification_subscriber"
end

require "meta_request/railtie"

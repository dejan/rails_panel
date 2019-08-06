# frozen_string_literal: true

module MetaRequest
  module LogInterceptor
    def debug(message = nil, *args)
      instrument(:debug, message) { super }
    end

    def info(message = nil, *args)
      instrument(:info, message) { super }
    end

    def warn(message = nil, *args)
      instrument(:warn, message) { super }
    end

    def error(message = nil, *args)
      instrument(:error, message) { super }
    end

    def fatal(message = nil, *args)
      instrument(:fatal, message) { super }
    end

    def unknown(message = nil, *args)
      instrument(:unknown, message) { super }
    end

    private

    def instrument(level, message)
      payload =  { level: level, message: message }
      ActiveSupport::Notifications.instrument 'meta_request.log', payload do
        yield
      end
    end
  end
end

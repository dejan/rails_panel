require 'callsite'

module MetaRequest
  module LogInterceptor

    def debug(*message)
      push_event(:debug, message.join(' '))
      super
    end

    def info(*message)
      push_event(:info, message.join(' '))
      super
    end

    def warn(*message)
      push_event(:warn, message.join(' '))
      super
    end

    def error(*message)
      push_event(:error, message.join(' '))
      super
    end

    def fatal(*message)
      push_event(:fatal, message.join(' '))
      super
    end

    def unknown(*message)
      push_event(:unknown, message.join(' '))
      super
    end


    private
    def push_event(level, message)
      dev_log = AppRequest.current && caller[1].include?(MetaRequest.rails_root)
      if dev_log
        c = Callsite.parse(caller[1])
        payload = {:message => message, :level => level, :line => c.line, :filename => c.filename, :method => c.method}
        AppRequest.current.events << Event.new('meta_request.log', 0, 0, 0, payload)
      end
    rescue Exception => e
      MetaRequest.logger.fatal(e.message + "\n " + e.backtrace.join("\n "))
    end
  end
end

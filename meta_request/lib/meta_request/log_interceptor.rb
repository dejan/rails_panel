require 'callsite'

module MetaRequest
  module LogInterceptor

    def debug(message=nil, *args)
      push_event(:debug, message)
      super
    end

    def info(message=nil, *args)
      push_event(:info, message)
      super
    end

    def warn(message=nil, *args)
      push_event(:warn, message)
      super
    end

    def error(message=nil, *args)
      push_event(:error, message)
      super
    end

    def fatal(message=nil, *args)
      push_event(:fatal, message)
      super
    end

    def unknown(message=nil, *args)
      push_event(:unknown, message)
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

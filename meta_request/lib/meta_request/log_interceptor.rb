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
      dev_callsite = AppRequest.current && Utils.dev_callsite(caller[1])
      if dev_callsite
        payload = {:message => message, :level => level, :line => dev_callsite.line, :filename => dev_callsite.filename, :method => dev_callsite.method}
        AppRequest.current.events << Event.new('meta_request.log', 0, 0, 0, payload)
      end
    rescue Exception => e
      MetaRequest.config.logger.fatal(e.message + "\n " + e.backtrace.join("\n "))
    end
  end
end

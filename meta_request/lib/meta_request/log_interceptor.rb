require 'callsite'

module MetaRequest
  module LogInterceptor

    %w( debug info warn error fatal ).each do |level|
      define_method(level) do |message|
        begin
          dev_log = AppRequest.current && !AppRequest.current.events.empty? && caller.first =~ /#{Rails.root}/
          if dev_log
            c = Callsite.parse(caller).first
            payload = {:message => message, :level => level, :line => c.line, :filename => c.filename, :method => c.method}
            AppRequest.current.events << Event.new('meta_request.log', 0, 0, 0, payload)
          end
        # MetaRequest bug should not break Rails
        rescue Exception => e
          MetaRequest.logger.fatal(e.message + "\n " + e.backtrace.join("\n "))
        ensure
          super(message)
        end
      end
    end

  end
end

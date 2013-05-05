module MetaRequest
  module LogInterceptor

    %w( debug info warn error fatal ).each do |level|
      define_method(level) do |message|
        dev_log = AppRequest.current && !AppRequest.current.events.empty? && caller.first =~ /#{Rails.root}/
        AppRequest.current.events << Event.new('meta_request.log', 0, 0, 0, {:line => message, :caller => caller.first, :level => level}) if dev_log
        super(level)
      end
    end

  end
end

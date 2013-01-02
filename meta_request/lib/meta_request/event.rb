module MetaRequest
  class Event < ActiveSupport::Notifications::Event

    def initialize(name, start, ending, transaction_id, payload)
      super(name, start, ending, transaction_id, payload)
      case @name
      when 'process_action.action_controller'
        @payload[:format] ||= (@payload[:formats]||[]).first # Rails 3.0.x Support
        @payload[:status] = '500' if @payload[:exception]
      end
    end

    def self.events_for_exception(exception_wrapper)
      exception = exception_wrapper.exception
      trace = exception_wrapper.application_trace
      trace = exception_wrapper.framework_trace if trace.empty?
      trace.unshift "#{exception.class} (#{exception.message})"
      trace.each do |call|
        Event.new('process_action.action_controller.exception', 0, 0, nil, {:call => call})
      end
    end

  end
end

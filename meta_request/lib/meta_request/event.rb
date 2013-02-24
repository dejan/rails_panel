module MetaRequest
  class Event < ActiveSupport::Notifications::Event

    def initialize(name, start, ending, transaction_id, payload)
      super(name, start, ending, transaction_id, payload)
      case @name
      when 'process_action.action_controller'
        @payload[:format] ||= (@payload[:formats]||[]).first # Rails 3.0.x Support
        @payload[:status] = '500' if @payload[:exception]
      end
      # When a tempfile has already been uploaded and closed/unlinked by another library (ie Dragonfly),
      # just ditch it so that #as_json won't try to read it and thereby crash Rails
      ignore_closed_tempfile_params if @payload[:params]
    end

    def self.events_for_exception(exception_wrapper)
      if defined?(ActionDispatch::ExceptionWrapper)
        exception = exception_wrapper.exception
        trace = exception_wrapper.application_trace
        trace = exception_wrapper.framework_trace if trace.empty?
      else
        exception = exception_wrapper
        trace = exception.backtrace
      end
      trace.unshift "#{exception.class} (#{exception.message})"
      trace.map do |call|
        Event.new('process_action.action_controller.exception', 0, 0, nil, {:call => call})
      end
    end

    def ignore_closed_tempfile_params
      @payload[:params].each do |param_key, param_value|
        next unless param_value.is_a? Hash
        param_value.each do |key, value|
          if value.respond_to?(:tempfile) && value.tempfile.closed?
            @payload[:params][param_key][key].tempfile = "closed tempfile"
          end
        end
      end
    end

  end
end

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
      exception = exception_wrapper.exception
      trace = exception_wrapper.application_trace
      trace = exception_wrapper.framework_trace if trace.empty?
      trace.unshift "#{exception.class} (#{exception.message})"
      trace.each do |call|
        Event.new('process_action.action_controller.exception', 0, 0, nil, {:call => call})
      end
    end

    def ignore_closed_tempfile_params
      @payload[:params].each do |key_1, value_1|
        next unless value_1.is_a? Hash
        value_1.each do |key_2, value_2|
          if value_2.respond_to?(:tempfile) && value_2.tempfile.closed?
            @payload[:params][key_1][key_2].tempfile = "closed tempfile"
          end
        end
      end
    end

  end
end

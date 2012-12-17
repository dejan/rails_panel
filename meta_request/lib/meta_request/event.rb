module MetaRequest
  class Event < ActiveSupport::Notifications::Event

    # opportunity to tweak event
    def initialize(name, start, ending, transaction_id, payload)
      super(name, start, ending, transaction_id, payload)
      case @name
      when 'process_action.action_controller'
        @payload[:status] = '500' if @payload[:exception]
      end
    end

  end
end

# frozen_string_literal: true

module MetaRequest
  class Event
    def self.subscribe(*events)
      events.each do |event_name|
        ActiveSupport::Notifications.subscribe(event_name) do |*args|
          next unless AppRequest.current
          name, start, finish, trans_id, payload = args
          duration = 1000.0 * (finish - start)
          yield(name, trans_id, duration, payload)
        end
      end
    end

    def self.subscribe_to_notifications
      require 'meta_request/event/action'
      require 'meta_request/event/cache'
      require 'meta_request/event/log'
      require 'meta_request/event/sql'
      require 'meta_request/event/view'
    end
  end
end

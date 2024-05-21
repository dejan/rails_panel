# frozen_string_literal: true

module MetaRequest
  module Subscribers
    class MongoCommandSubscriber
      def started(event)
        # puts "Started #{event.command_name}: #{event.command}"
      end

      def failed(event)
        # puts "Failed #{event.command_name}: #{event.message}"
      end

      def succeeded(event)
        start_time = Time.now - event.duration
        end_time = Time.now
        transaction_id = event.request_id
        command = event.started_event.command.to_json
        payload = { name: event.command_name, sql: command }
        ActiveSupport::Notifications.publish('sql.active_record', start_time, end_time, transaction_id, payload)
      end
    end
  end
end

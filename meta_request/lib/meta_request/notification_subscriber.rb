module MetaRequest
  class NotificationSubscriber
    def initialize
      ActiveSupport::Notifications.subscribe do |*args|
        name, start, ending, transaction_id, payload = *args
        current_transaction = Transaction.current
        current_transaction.try(:add_event, name, start, ending, payload)
      end
    end
  end
end

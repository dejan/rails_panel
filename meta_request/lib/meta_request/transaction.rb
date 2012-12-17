require 'json'

module MetaRequest
  class Transaction
    attr_reader :id, :events

    def initialize(id)
      @id = id
      @events = []
    end

    def add_event(name, start, ending, payload)
      event = Event.new(name, start, ending, @id, payload)
      @events << event
    end

    def self.current
      Thread.current[thread_current_key]
    end

    def self.set_current(transaction)
      Thread.current[thread_current_key] = transaction
    end

    private

    def self.thread_current_key
      :__meta_request_transaction_id
    end
  end
end


require 'json'

module MetaRequest
  class TransactionStorage
    def initialize(path)
      @store = ActiveSupport::Cache::FileStore.new(path)
    end

    def write(transaction)
      @store.write(transaction.id, JSON.dump(transaction.events))
    end

    def read(id)
      @store.read(id)
    end
  end
end

module MetaRequest
  class MetaRequestHandler < Handler
    def initialize(transaction_id)
      @transaction_id = transaction_id
    end

    def process(app, env)
      transaction = transaction_storage.read(@transaction_id)
      [200, { "Content-Type" => "text/plain; charset=utf-8" }, [transaction]]
    end
  end
end

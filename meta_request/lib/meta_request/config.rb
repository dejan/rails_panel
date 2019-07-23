module MetaRequest
  class Config
    attr_writer :logger, :storage_pool_size

    # logger used for reporting gem's fatal errors
    def logger
      @logger ||= Logger.new(File.join(Rails.root, 'log', 'meta_request.log'))
    end

    # Number of files kept in storage.
    # Increase when using an application loading many simultaneous requests.
    def storage_pool_size
      @storage_pool_size ||= 20
    end
  end
end

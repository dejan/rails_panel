# frozen_string_literal: true

module MetaRequest
  class Config
    attr_writer :logger, :storage_pool_size, :source_path

    # logger used for reporting gem's fatal errors
    def logger
      @logger ||= Logger.new(File.join(Rails.root, 'log', 'meta_request.log'))
    end

    # Number of files kept in storage.
    # Increase when using an application loading many simultaneous requests.
    def storage_pool_size
      @storage_pool_size ||= 20
    end

    def source_path
      @source_path ||= ENV['SOURCE_PATH'] || Rails.root.to_s
    end
  end
end

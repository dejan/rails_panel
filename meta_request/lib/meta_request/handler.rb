require 'fileutils'

module MetaRequest
  class Handler
    def self.lookup(path)
      path[%r{^/__meta_request/(.+)\.json$}]
      transaction_id = $1
      transaction_id ?
        MetaRequestHandler.new(transaction_id) :
          AppRequestHandler.new
    end

    private

    def transaction_storage
      dir_path = File.join(Dir.pwd, 'tmp/cache/meta_request')
      FileUtils.mkdir_p dir_path
      MetaRequest::TransactionStorage.new dir_path
    end
  end
end

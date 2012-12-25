module MetaRequest
  class AppRequest
    attr_reader :id, :events

    def initialize(id, events = [])
      @id = id
      @events = events
    end

    def self.current
      Thread.current[:meta_request_id]
    end

    def self.find(id)
      new(id, storage.read(id))
    end

    def current!
      Thread.current[:meta_request_id] = self
    end

    def save
      storage.write(id, events)
      maintain_key_pool(id)
      logger.debug("REQUEST-ID: #{id}; EVENTS: #{events.inspect}")
      self
    end

    def destroy
      storage.delete(id)
    end

    private
    # keeps cache size small
    def maintain_key_pool(id, size=10)
      key_pool = storage.read(:key_pool) || []
      key_pool.unshift(id)
      keep, clear = key_pool.each_slice(size).to_a
      (clear||[]).each do |key|
        storage.delete(key)
      end
      storage.write(:key_pool, keep)
    end

    def storage
      self.class.storage
    end

    def self.storage
      @@storage ||= build_storage
    end

    def self.build_storage
      dir_path = File.join(Dir.pwd, 'tmp/cache/meta_request')
      FileUtils.mkdir_p dir_path
      ActiveSupport::Cache::FileStore.new(dir_path)
    end

    def logger
      @logger ||= Logger.new(File.join(Dir.pwd, 'log/meta_request.log'))
    end
  end
end

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
      self.class.storage.write(id, events)
    end

    def destroy
      self.class.storage.delete(id)
    end

    private 
    def self.storage
      @@storage ||= build_storage
    end

    def self.build_storage
      dir_path = File.join(Dir.pwd, 'tmp/cache/meta_request')
      FileUtils.mkdir_p dir_path
      ActiveSupport::Cache::FileStore.new(dir_path)
    end
  end
end

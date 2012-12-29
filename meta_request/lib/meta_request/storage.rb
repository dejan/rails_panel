module MetaRequest
  class Storage
    attr_reader :key

    def initialize(key)
      @key = key
    end

    def write(value)
      FileUtils.mkdir_p dir_path
      File.open(json_file, 'w') { |file| file.write(value) }
      maintain_file_pool(10)
    end

    def read
      File.read(json_file)
    end
    
    private

    def maintain_file_pool(size)
      files = Dir["#{dir_path}/*.json"]
      files = files.sort_by { |c| -File.stat(c).ctime.to_i }
      (files[size..-1] || []).each do |file|
        FileUtils.rm(file)
      end
    end

    def json_file
      File.join(dir_path, "#{key}.json")
    end

    def dir_path
      File.join(Dir.pwd, 'tmp', 'data', 'meta_request')
    end
  end
end

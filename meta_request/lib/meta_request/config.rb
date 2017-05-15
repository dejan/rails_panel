require 'yaml'

module MetaRequest
  class Config
    # logger used for reporting gem's fatal errors
    def logger
      @logger ||= Logger.new(File.join(Rails.root, 'log', 'meta_request.log'))
    end

    # Number of files kept in storage.
    # Increase when using an application loading many simultaneous requests.
    def storage_pool_size
      @storage_pool_size ||= 20
    end
    
    def self.ignored_path?(file_path)
      ingore_paths.any? { |ignore_path| ignore_path.match(file_path) }
    end

    def self.config_file
      @@config_file ||= load_and_parse_config_file
    end

    private

    def self.ingore_paths
      config_file[:ignore_paths]
    end

    def self.load_and_parse_config_file
      @@config_file = load_config_file
      @@config_file[:ignore_paths] ||= []
      @@config_file[:ignore_paths].map! do |ignore_path|
        Regexp.new(ignore_path)
      end
      @@config_file.freeze
    end

    def self.load_config_file
      YAML.load_file("#{MetaRequest.rails_root}/config/meta_request.yml") || {}
    rescue Errno::ENOENT
      {}
    end
  end
end

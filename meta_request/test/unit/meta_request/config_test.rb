require 'test_helper'
require 'tempfile'
require 'fileutils'

describe MetaRequest::Config do
  CONFIG_DIRECTORY = "#{MetaRequest.rails_root}/config"
  CONFIG_FILE_PATH = "#{CONFIG_DIRECTORY}/meta_request.yml"

  def write_config_file(config)
    file = File.new(CONFIG_FILE_PATH, "w")
    file.write(config.to_yaml)
    file.close
  end

  before(:each) do
    FileUtils.mkdir_p(CONFIG_DIRECTORY)
  end

  after(:each) do
    FileUtils.remove_dir(CONFIG_DIRECTORY, force: true)
    MetaRequest::Config.class_variable_set(:@@config_file, nil)
  end

  describe 'config_file' do
    it 'provides default config when config file is not present' do
      assert_equal [], MetaRequest::Config.config_file[:ignore_paths]
    end

    it 'provides default config when config file is empty' do
      write_config_file(nil)
      assert_equal [], MetaRequest::Config.config_file[:ignore_paths]
    end

    it 'converts ignore paths array to regexs' do
      config = {
        ignore_paths: ['.*files', 'notaregex']
      }
      expected_ignore_paths = config[:ignore_paths].map { |p| Regexp.new(p) }
      write_config_file(config)
      assert_equal expected_ignore_paths, MetaRequest::Config.config_file[:ignore_paths]
    end
  end

  describe 'ignored_path?' do
    it 'does not ignore files if the ignore_paths option is empty' do
      assert_equal [], MetaRequest::Config.config_file[:ignore_paths]
      assert_equal false, MetaRequest::Config.ignored_path?('this/file/is/not/ignored.txt')
    end

    it 'ignores files that match the ignore_paths' do
      config = {
        ignore_paths: ['.*ignored.*', 'notaregex']
      }
      write_config_file(config)
      assert_equal true, MetaRequest::Config.ignored_path?('this/file/is/ignored.txt')
      assert_equal true, MetaRequest::Config.ignored_path?('notaregex')
      assert_equal false, MetaRequest::Config.ignored_path?('this/file/is/included.txt')
    end

  end
end


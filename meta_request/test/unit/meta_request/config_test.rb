require 'test_helper'

describe MetaRequest::Config do
  let(:config) { MetaRequest::Config.new }

  describe 'logger' do
    it 'is present by default' do
      FileUtils.mkdir_p File.join(Rails.root, 'log')
      assert_kind_of Logger, config.logger
    end

    it 'can be customized' do
      new_logger = Logger.new STDOUT
      config.logger = new_logger
      assert_equal new_logger, config.logger
    end
  end

  describe 'storage_pool_size' do
    it 'is 20 by default' do
      assert_equal 20, config.storage_pool_size
    end

    it "can be customized" do
      config.storage_pool_size = 50
      assert_equal 50, config.storage_pool_size
    end
  end
end

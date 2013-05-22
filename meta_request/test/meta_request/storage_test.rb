require 'test_helper'

describe MetaRequest::Storage do
  before do
    @dir_path = MetaRequest::Storage.new(nil).send(:dir_path)
    FileUtils.mkdir_p @dir_path
  end

  describe 'write' do
    it 'writes to file' do
      MetaRequest::Storage.new('1234').write('abcdef')
      assert_equal 'abcdef', File.read("#{@dir_path}/1234.json")
    end
  end

  describe 'read' do
    it 'reads from file' do
      File.open("#{@dir_path}/foo.json", "w") { |file| file.write('bar') }
      assert_equal 'bar', MetaRequest::Storage.new('foo').read
    end
  end

  after do
    FileUtils.rm_rf "#{Rails.root}/tmp"
  end
end

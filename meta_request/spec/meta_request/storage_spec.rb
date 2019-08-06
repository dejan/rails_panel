# frozen_string_literal: true

require 'spec_helper'

RSpec.describe MetaRequest::Storage do
  let!(:dir_path) do
    MetaRequest::Storage.new(nil).send(:dir_path).tap do |dir|
      FileUtils.mkdir_p dir
    end
  end

  describe '#write' do
    it 'writes to file' do
      MetaRequest::Storage.new('1234').write('abcdef')
      expect(File.read("#{dir_path}/1234.json")).to eq('abcdef')
    end
  end

  describe '#read' do
    it 'reads from file' do
      File.open("#{dir_path}/foo.json", 'w') { |file| file.write('bar') }
      expect(MetaRequest::Storage.new('foo').read).to eq('bar')
    end
  end

  after do
    FileUtils.rm_rf "#{Rails.root}/tmp"
  end
end

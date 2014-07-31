require 'rubygems'
require 'bundler/setup'
require 'meta_request'
require 'minitest/autorun'
require 'minitest/mock'

module Rails
  def self.root
    Dir.pwd
  end
end

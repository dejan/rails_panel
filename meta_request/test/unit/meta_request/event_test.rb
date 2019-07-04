require 'test_helper'
require 'tempfile'

describe MetaRequest::Event do
  describe "ignores objects that can't be encoded as json" do
    it 'sets closed tempfiles in params to strings on create' do
      not_serializable_object = Object.new
      not_serializable_object.define_singleton_method(:to_json) { raise "error" }
      payload = {:params => {"user" => {"upload" => not_serializable_object} } }.with_indifferent_access

      event = MetaRequest::Event.new('process_action.action_controller', 10, 11, 1705, payload)
      assert_equal 'Not JSON Encodable', event.payload[:params][:user][:upload]
    end
  end
end


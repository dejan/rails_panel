require 'test_helper'
require 'tempfile'
require 'active_support/core_ext/hash/indifferent_access'

describe MetaRequest::Event do
  describe 'process_action.action_controller' do
    describe 'status' do
      it 'sets it to 500 if payload has exception key present' do
        event1 = MetaRequest::Event.new('process_action.action_controller', 10, 11, 1705, {status:'200'})
        event2 = MetaRequest::Event.new('process_action.action_controller', 10, 11, 1705, {exception:'...'})
        assert_equal '200', event1.payload[:status]
        assert_equal '500', event2.payload[:status]
      end
    end

    describe 'format' do
      # Rails 3.0.x support
      it 'sets it to first of formats if not set' do
        event1 = MetaRequest::Event.new('process_action.action_controller', 10, 11, 1705, {format:'html'})
        event2 = MetaRequest::Event.new('process_action.action_controller', 10, 11, 1705, {formats:['js']})
        assert_equal 'html', event1.payload[:format]
        assert_equal 'js', event2.payload[:format]
      end
    end
  end

  describe 'ignore_closed_tempfile_params' do
    it 'sets closed tempfiles in params to strings on create' do
      payload = {params: {"user" => {"upload" => OpenStruct.new(tempfile: Tempfile.new('foo'))} } }.with_indifferent_access
      event_1 = MetaRequest::Event.new('process_action.action_controller', 10, 11, 1705, payload)
      assert_equal payload[:params][:user][:upload].tempfile, event_1.payload[:params][:user][:upload].tempfile

      payload[:params][:user][:upload].tempfile.close
      event_2 = MetaRequest::Event.new('process_action.action_controller', 10, 11, 1705, payload)
      assert_equal 'closed tempfile', event_2.payload[:params][:user][:upload].tempfile
    end
  end
end


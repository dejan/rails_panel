require 'test_helper'
require 'tempfile'

describe MetaRequest::Event do
  describe 'ignore_closed_tempfile_params' do
    it 'sets closed tempfiles in params to strings on create' do
      tempfile = Tempfile.new('foo')
      payload = {:params => {"user" => {"upload" => OpenStruct.new(:tempfile => tempfile)} } }.with_indifferent_access
      event_1 = MetaRequest::Event.new('process_action.action_controller', 10, 11, 1705, payload)
      assert_same tempfile, event_1.payload[:params][:user][:upload].tempfile

      payload[:params][:user][:upload].tempfile.close
      event_2 = MetaRequest::Event.new('process_action.action_controller', 10, 11, 1705, payload)
      assert_equal 'Not JSON Encodable', event_2.payload[:params][:user][:upload]
    end
  end

  describe 'filter closed io objects in payload since they error on to_json' do
    before do
      io = Tempfile.new('foo')
      io.close
      @event = MetaRequest::Event.new('sql.active_record', 10, 11, 1705, {:sql => 'select now();', :binds => io})
    end

    it 'should be filtered out' do
      assert_equal({'sql' => 'select now();', 'binds' => 'Not JSON Encodable'}, @event.payload)
    end

    it 'should work to_json' do
      @event.payload.to_json
    end
  end
end


require 'test_helper'

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
end


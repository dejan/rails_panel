require 'test_helper'

describe MetaRequest::AppNotifications do
  describe 'process_action.action_controller' do
    before do
      @app_request = MetaRequest::AppRequest.new(17)
      @app_request.current!
      MetaRequest::AppNotifications.subscribe
    end

    describe 'status' do
      it 'sets it to 500 if payload has exception key present' do
        ActiveSupport::Notifications.instrument 'process_action.action_controller', {:exception => '...'}
        assert_equal '500', @app_request.events.last.payload[:status]
      end
    end

    describe 'format' do
      it 'sets it' do
        ActiveSupport::Notifications.instrument 'process_action.action_controller', {:format => 'html'}
        assert_equal 'html', @app_request.events.last.payload[:format]
      end

      # Rails 3.0.x support
      it 'sets it to first of formats if not set' do
        ActiveSupport::Notifications.instrument 'process_action.action_controller', {:formats => ['js']}
        assert_equal 'js', @app_request.events.last.payload[:format]
      end
    end
  end
end



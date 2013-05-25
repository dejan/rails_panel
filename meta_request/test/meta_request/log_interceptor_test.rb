require 'test_helper'
require 'logger'

describe MetaRequest::LogInterceptor do
  before do
    @app_request = MetaRequest::AppRequest.new(17)
    @app_request.current!
    @app_request.events << 'mock'
    @logger = Logger.new("/dev/null")
    @logger.extend(MetaRequest::LogInterceptor)
  end

  it 'adds app request events on log calls' do
    @logger.info('Ohai!')
    assert_equal 2, @app_request.events.size
    last_event = @app_request.events.last
    assert_equal 'Ohai!', last_event.payload[:message]
    assert_equal 14, last_event.payload[:line]
    assert_match /test\/meta_request\/log_interceptor_test.rb$/, last_event.payload[:filename]
    assert_equal :info, last_event.payload[:level]
  end
end

# frozen_string_literal: true

require 'spec_helper'
require 'logger'

RSpec.describe MetaRequest::LogInterceptor do
  let!(:app_request) do
    MetaRequest::AppRequest.new(17).tap do |req|
      req.current!
      req.events << 'mock'
    end
  end

  let!(:logger) do
    Logger.new('/dev/null').tap do |log|
      log.extend(MetaRequest::LogInterceptor)
    end
  end

  it 'adds app request events on log calls' do
    logger.info('Ohai!')
    expect(app_request.events.size).to eq(2)
    last_event = app_request.events.last
    expect(last_event.payload[:message]).to eq('Ohai!')
    expect(last_event.payload[:line]).to eq(21)
    expect(last_event.payload[:filename]).to match(%r{spec/meta_request/log_interceptor_spec.rb$})
    expect(last_event.payload[:level]).to eq(:info)
  end
end

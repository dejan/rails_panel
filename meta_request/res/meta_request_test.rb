# frozen_string_literal: true

require 'test_helper'

class MetaRequestTest < ActionDispatch::IntegrationTest
  def cleanup
    FileUtils.rm_rf(Rails.root.join('tmp', 'data', 'meta_request'))
  end

  setup do
    cleanup
    get '/'
    @request_id = response.headers['X-Request-Id']
  end

  test 'it should have a request_id header' do
    assert @request_id
  end

  test 'it should have a meta_request version header' do
    assert_equal MetaRequest::VERSION, response.headers['X-Meta-Request-Version']
  end

  test 'should create a request file' do
    assert_equal 1, Dir[Rails.root.join('tmp/data/meta_request/*.json')].size
  end

  test 'should serve a meta_request' do
    get "/__meta_request/#{@request_id}.json"
    assert_response 200
  end
end

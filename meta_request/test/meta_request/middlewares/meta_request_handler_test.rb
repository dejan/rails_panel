require 'test_helper'

describe MetaRequest::Middlewares::MetaRequestHandler do
  before do
    MetaRequest::Storage.new('1234').write('abcdef')
    @app = MiniTest::Mock.new
    @middleware = MetaRequest::Middlewares::MetaRequestHandler.new(@app)
  end

  describe 'app request call' do
    it 'pushes request through the rest of the stack' do
      env = {'PATH_INFO' => 'posts/1'}
      @app.expect(:call, ':)', [env])
      @middleware.call(env)
      assert @app.verify
    end
  end

  describe 'meta request call' do
    it 'responds with json file' do
      env = {'PATH_INFO' => '/__meta_request/1234.json'}
      response = @middleware.call(env)
      assert_equal [200, { "Content-Type" => "text/plain; charset=utf-8" }, ['abcdef']], response 
    end
  end

  describe 'meta request call within a subfolder' do
    it 'responds with json file' do
      env = {'PATH_INFO' => '/any/subfolder/__meta_request/1234.json'}
      response = @middleware.call(env)
      assert_equal [200, { "Content-Type" => "text/plain; charset=utf-8" }, ['abcdef']], response
    end
  end

  after do
    FileUtils.rm_rf "#{Dir.pwd}/tmp"
  end
end

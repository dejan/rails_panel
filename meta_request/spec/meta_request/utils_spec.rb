# frozen_string_literal: true

require 'spec_helper'

RSpec.describe MetaRequest::Utils, '.dev_callsite' do
  it 'returns first call site from the app iself' do
    filename = File.join(MetaRequest.rails_root, 'test_file.rb')
    line = 87
    method = 'app_func'

    stacktrace = [
      "/gem/gem_file.rb:1:in `func'`",
      "#{filename}:#{line}:in `#{method}'",
      "/gem/gem_file.rb:1:in `func2'`"
    ]

    expect(MetaRequest::Utils.dev_callsite(stacktrace)).to eq(
      filename: filename, line: line, method: method
    )
  end

  it 'returns nil if the stacktrace contains only call sites outside of the app' do
    stacktrace = [
      "/gem/gem_file.rb:1:in `func'`",
      "/gem/gem_file.rb:1:in `func2'`"
    ]

    expect(MetaRequest::Utils.dev_callsite(stacktrace)).to be(nil)
  end

  it 'replaces filename with the provided source path configuration' do
    MetaRequest.config.source_path = '/Users/foo/bar'

    filename = File.join(MetaRequest.rails_root, 'test_file.rb')
    line = 87
    method = 'app_func'
    stacktrace = [
      "#{filename}:#{line}:in `#{method}'"
    ]

    expect(MetaRequest::Utils.dev_callsite(stacktrace)).to eq(
      filename: '/Users/foo/bar/test_file.rb', line: line, method: method
    )

    # revert configuration
    MetaRequest.config.source_path = MetaRequest.rails_root
  end
end

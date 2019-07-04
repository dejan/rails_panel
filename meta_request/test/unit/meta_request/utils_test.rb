require 'test_helper'

describe MetaRequest::Utils do
  describe ".dev_callsite" do
    it "returns line parsed with Callsite if rails root is found in multi-line trace" do
      stacktrace = [
        "/gem/gem_file.rb:1:in `func'`",
        "#{File.join(MetaRequest.rails_root, "test_file.rb")}:87:in `app_func'",
        "/gem/gem_file.rb:1:in `func2'`",
      ]
      expected_callsite_line = Callsite::Line.new("#{Rails.root}/test_file.rb", 87, "app_func")
      assert_equal expected_callsite_line, MetaRequest::Utils.dev_callsite(stacktrace)
    end

    it "returns nil if multi-line trace doesn't match app root" do
      stacktrace = [
        "/gem/gem_file.rb:1:in `func'`",
        "/prefix/#{File.join(MetaRequest.rails_root, "test_file.rb")}:87:in `app_func'",
        "/gem/gem_file.rb:1:in `func2'`",
      ]
      assert_nil MetaRequest::Utils.dev_callsite(stacktrace)
    end

    it "returns line parsed with Callsite if rails root is found in a single line trace" do
      stacktrace = "#{File.join(MetaRequest.rails_root, "test_file.rb")}:87:in `app_func'"
      expected_callsite_line = Callsite::Line.new("#{Rails.root}/test_file.rb", 87, "app_func")
      assert_equal expected_callsite_line, MetaRequest::Utils.dev_callsite(stacktrace)
    end

    it "returns nil if single-line trace doesn't match app root" do
      stacktrace =  "/gem/gem_file.rb:1:in `func'`"

      assert_nil MetaRequest::Utils.dev_callsite(stacktrace)
    end
  end
end

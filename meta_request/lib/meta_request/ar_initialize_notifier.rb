module MetaRequest
  module ARInitializeNotifier
    def self.included(base)
      base.after_initialize :report_record
    end

    private

    def get_framework_caller
      stack = caller.dup

      while !stack.empty?
        filename = Callsite.parse(stack.first).filename
        case filename
        when /^#{Rails.root}/
          break
        when /active_record.rb$/
          stack.shift
          break
        else
          stack.shift
        end
      end

      if stack.empty?
        Callsite.parse(caller.last)
      else
        Callsite.parse(stack.first)
      end
    end

    def report_record
      c = get_framework_caller

      info = {}
      info[:class]    = self.class.base_class.to_s
      info[:line]     = c.line
      info[:filename] = c.filename.gsub(/^#{Rails.root}/, '').gsub(/^#{Gem.path.join('|')}/, '')
      info[:method]   = c.method

      ActiveSupport::Notifications.instrument("active_record.initialize", info)
    end
  end
end

if defined?(ActiveRecord)
  ActiveRecord::Base.class_eval do
    include MetaRequest::ARInitializeNotifier
  end
end

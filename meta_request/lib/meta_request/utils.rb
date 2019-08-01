require 'callsite'

module MetaRequest
  module Utils
    extend self

    # @return [Callsite::Line, nil]
    def dev_callsite(caller)
      app_line = Array(caller).detect { |c| c.start_with? MetaRequest.rails_root }
      Callsite.parse(app_line) if app_line
    end
  end
end

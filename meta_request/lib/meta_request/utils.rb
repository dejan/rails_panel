# frozen_string_literal: true

module MetaRequest
  module Utils
    module_function

    def dev_callsite(caller)
      app_line = caller.detect { |c| c.start_with? MetaRequest.rails_root }
      return nil unless app_line

      _, filename, _, line, _, method = app_line.split(/^(.*?)(:(\d+))(:in `(.*)')?$/)

      {
        filename: sub_source_path(filename),
        line: line.to_i,
        method: method
      }
    end

    def sub_source_path(path)
      rails_root = MetaRequest.rails_root
      source_path = MetaRequest.config.source_path
      return path if rails_root == source_path

      path.sub(rails_root, source_path)
    end
  end
end

module MetaRequest
  class AppNotifications

    # Subscribe to all events relevant to RailsPanel
    #
    def self.subscribe
      new.
        subscribe("meta_request.log").
        subscribe("sql.active_record") do |*args|
          name, start, ending, transaction_id, payload = args
          dev_caller = caller.select { |c| c=~/#{Rails.root}/}.first
          if dev_caller
            c = Callsite.parse(dev_caller)
            payload.merge!(:line => c.line, :filename => c.filename, :method => c.method)
          end
          Event.new(name, start, ending, transaction_id, payload)
        end.
        subscribe("render_partial.action_view").
        subscribe("render_template.action_view").
        subscribe("process_action.action_controller.exception").
        subscribe("process_action.action_controller") do |*args|
          name, start, ending, transaction_id, payload = args
          data = args.extract_options!
          if data.has_key?(:controller)
            controller_location = data[:controller].constantize.new.method(data[:action]).source_location
            payload[:controller_filename] = controller_location[0]
            payload[:controller_linenumber] = controller_location[1]
          end
          payload[:format] ||= (payload[:formats]||[]).first # Rails 3.0.x Support
          payload[:status] = '500' if payload[:exception]
          Event.new(name, start, ending, transaction_id, payload)
        end
    end

    def subscribe(event_name)
      ActiveSupport::Notifications.subscribe(event_name) do |*args|
        event = block_given?? yield(*args) : Event.new(*args)
        AppRequest.current.events << event if AppRequest.current
      end
      self
    end

  end

end


module MetaRequest
  class AppNotifications

    # these are the specific keys in the cache payload that we display in the
    # panel view
    CACHE_KEY_COLUMNS = [:key, :hit, :options, :type]

    # define this here so we can pass it in to all of our cache subscribe calls
    CACHE_BLOCK = Proc.new {|*args|
      name, start, ending, transaction_id, payload = args

      # from http://edgeguides.rubyonrails.org/active_support_instrumentation.html#cache-fetch-hit-active-support
      #
      # :super_operation	:fetch is added when a read is used with #fetch
      #
      # so if :super_operation is present, we'll use it for the type. otherwise
      # strip (say) 'cache_delete.active_support' down to 'delete'
      payload[:type] = payload.delete(:super_operation) || name.sub(/cache_(.*?)\..*$/, '\1')

      # anything that isn't in CACHE_KEY_COLUMNS gets shoved into :options
      # instead
      payload[:options] = {}
      payload.keys.each do |k|
        payload[:options][k] = payload.delete(k) unless k.in? CACHE_KEY_COLUMNS
      end

      dev_caller = caller.detect { |c| c.include? MetaRequest.rails_root }
      if dev_caller
        c = Callsite.parse(dev_caller)
        payload.merge!(:line => c.line, :filename => c.filename, :method => c.method)
      end

      Event.new(name, start, ending, transaction_id, payload)
    }

    # sql processing block - used for sql.active_record and sql.sequel

    # HACK: we hardcode the event name to 'sql.active_record' so that the ui will
    # display sequel events without modification. otherwise the ui would need to
    # be modified to support a sequel tab (or to change the display name on the
    # active_record tab when necessary - which maybe makes more sense?)
    SQL_EVENT_NAME = "sql.active_record"

    SQL_BLOCK = Proc.new {|*args|
      name, start, ending, transaction_id, payload = args
      dev_caller = caller.detect { |c| c.include? MetaRequest.rails_root }
      if dev_caller
        c = Callsite.parse(dev_caller)
        payload.merge!(:line => c.line, :filename => c.filename, :method => c.method)
      end
      Event.new(SQL_EVENT_NAME, start, ending, transaction_id, payload)
    }
    # Subscribe to all events relevant to RailsPanel
    #
    def self.subscribe
      new.
        subscribe("meta_request.log").
        subscribe("sql.active_record", &SQL_BLOCK).
        subscribe("sql.sequel", &SQL_BLOCK).
        subscribe("render_partial.action_view").
        subscribe("render_template.action_view").
        subscribe("process_action.action_controller.exception").
        subscribe("process_action.action_controller") do |*args|
          name, start, ending, transaction_id, payload = args
          payload[:status] = '500' if payload[:exception]
          Event.new(name, start, ending, transaction_id, payload)
        end.
        subscribe("cache_read.active_support", &CACHE_BLOCK).
        subscribe("cache_generate.active_support", &CACHE_BLOCK).
        subscribe("cache_fetch_hit.active_support", &CACHE_BLOCK).
        subscribe("cache_write.active_support", &CACHE_BLOCK).
        subscribe("cache_delete.active_support", &CACHE_BLOCK).
        subscribe("cache_exist?.active_support", &CACHE_BLOCK)
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

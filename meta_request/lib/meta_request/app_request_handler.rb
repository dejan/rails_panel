module MetaRequest
  class AppRequestHandler < Handler

    def process(app, env)
      request_id = env["action_dispatch.request_id"]
      transaction = MetaRequest::Transaction.new(request_id)
      MetaRequest::Transaction.set_current(transaction)
      app.call(env)
    rescue Exception => e
      calls(env, e).each do |call|
        transaction.add_event('process_action.action_controller.exception', 0, 0, {:call => call})
      end
      raise
    ensure
      transaction_storage.write(transaction)
      MetaRequest::Transaction.set_current nil
    end

    private

    def calls(env, exception)
      wrapper = ActionDispatch::ExceptionWrapper.new(env, exception)
      exception = wrapper.exception
      trace = wrapper.application_trace
      trace = wrapper.framework_trace if trace.empty?
      trace.unshift "#{exception.class} (#{exception.message})"
    end
  end
end


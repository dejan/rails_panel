# frozen_string_literal: true

MetaRequest::Event.subscribe(

  'process_action.action_controller',

) do |name, _trans_id, _duration, payload|
  payload[:status] = '500' if payload[:exception]
  {
    name: name,
    payload: payload.slice(
      :controller,
      :action,
      :format,
      :status,
      :view_runtime,
      :db_runtime,
      :params)
  }
end

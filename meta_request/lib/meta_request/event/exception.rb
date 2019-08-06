# frozen_string_literal: true

MetaRequest::Event.subscribe(

  'process_action.action_controller.exception',

) do |name, _trans_id, _duration, payload|
  {
    name: name,
    payload: payload
  }
end

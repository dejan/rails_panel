# frozen_string_literal: true

MetaRequest::Event.subscribe(

  'meta_request.log',

) do |name, _trans_id, _duration, payload|
  {
    name: name,
    payload: payload.slice(
      :level,
      :message)
  }
end

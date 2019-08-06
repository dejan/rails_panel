# frozen_string_literal: true

MetaRequest::Event.subscribe(

  'render_partial.action_view',
  'render_template.action_view'

) do |_name, _trans_id, duration, payload|
  {
    name: 'render_template.action_view',
    duration: duration,
    payload: {
      identifier: MetaRequest::Utils.sub_source_path(payload[:identifier]),
      layout: payload[:layout]
    }
  }
end

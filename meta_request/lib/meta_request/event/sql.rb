# frozen_string_literal: true

MetaRequest::Event.subscribe(

  'sql.active_record',
  'sql.sequel'

) do |_name, _trans_id, duration, payload|
  {
    name: 'sql.active_record',
    duration: duration,
    payload: payload.slice(
      :sql,
      :filename,
      :line,
      :name)
  }
end

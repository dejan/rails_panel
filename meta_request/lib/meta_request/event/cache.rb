# frozen_string_literal: true

MetaRequest::Event.subscribe(

  'cache_read.active_support',
  'cache_generate.active_support',
  'cache_fetch_hit.active_support',
  'cache_write.active_support',
  'cache_delete.active_support',
  'cache_exist?.active_support'

) do |name, _trans_id, duration, payload|

  # from http://edgeguides.rubyonrails.org/active_support_instrumentation.html#cache-fetch-hit-active-support
  #
  # :super_operation  :fetch is added when a read is used with #fetch
  #
  # so if :super_operation is present, we'll use it for the type. otherwise
  # strip (say) 'cache_delete.active_support' down to 'delete'
  operation_type = payload.delete(:super_operation) || name.sub(/cache_(.*?)\..*$/, '\1')

  {
    name: 'sql.active_record',
    duration: duration,
    payload: {
      key: payload[:key],
      hit: payload[:hit],
      options: payload[:options],
      type: operation_type
    }
  }
end

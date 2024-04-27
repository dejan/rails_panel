import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useEventsStore = defineStore('events',  () => {

  const selectedRequest = ref(null);

  // trick to prevent deselecting request
  watch(selectedRequest, (newVal, oldVal) => {
    if (newVal === null && actions.value.size > 0) {
      selectedRequest.value = oldVal;
    }
  })

  // key: requestId, value: event
  const actions = ref(new Map());
  
  // key: requestId, value: [...events]
  const activeRecordQueries = ref(new Map());
  const actionViewRenders = ref(new Map());
  const logEntries = ref(new Map());
  const exceptionStacktraces = ref(new Map());
  const cacheCalls = ref(new Map());

  const requests = computed(() => Array.from(actions.value.values()));

  const selectedActiveRecordQueries = computed(() => activeRecordQueries.value.get(selectedRequest.value.id));
  const selectedActionViewRenders = computed(() => actionViewRenders.value.get(selectedRequest.value.id));
  const selectedLogEntries = computed(() => logEntries.value.get(selectedRequest.value.id));
  const selectedExceptionStacktraces = computed(() => exceptionStacktraces.value.get(selectedRequest.value.id));
  const selectedCacheCalls = computed(() => cacheCalls.value.get(selectedRequest.value.id));
  const selectedParams = computed(() => selectedRequest.value.params);

  function pushEvents(requestId, newEvents, autoReselect = true) {
    const actionEvent = newEvents.find((event) => event.name == "process_action.action_controller")
    const action = {
      id: requestId,
      name: "process_action.action_controller",
      status: actionEvent.payload.status || 200,
      action: actionEvent.payload.controller + "#" + actionEvent.payload.action,
      method: actionEvent.payload.method,
      format: actionEvent.payload.format,
      duration: actionEvent.duration,
      params: Object.entries(actionEvent.payload.params).map(([name, value]) => ({ name, value }) )
    }
    actions.value.set(requestId, action);
    
    if (actions.value.size == 1 || autoReselect) {
      selectedRequest.value = action;
    }

    activeRecordQueries.value.set(requestId, newEvents.flatMap((event) => {
      if (event.name == "sql.active_record" && event.payload.name != "SCHEMA" && event.payload.name != "EXPLAIN") {
        return [{
          location: event.payload.filename,
          line: event.payload.line,
          type: event.payload.name,
          query: event.payload.sql,
          binds: event.payload.type_casted_binds,
          duration: event.duration
        }]
      } else {
        return []
      }
    }));

    actionViewRenders.value.set(requestId, newEvents.flatMap((event) => {
      if (event.name == "render_template.action_view" || event.name == "render_partial.action_view") {
        return [{
          view: event.payload.identifier,
          layout: event.payload.layout,
          duration: event.duration
        }]
      } else {
        return []
      }
    }));

    logEntries.value.set(requestId, newEvents.flatMap((event) => {
      if (event.name == "meta_request.log" && event.payload.message) {
        return [{
          filename: event.payload.filename,
          line: event.payload.line,
          message: event.payload.message,
          level: event.payload.level,
        }]
      } else {
        return []
      }        
    }));

    exceptionStacktraces.value.set(requestId, newEvents.flatMap((event) => {
      if (event.name == "process_action.action_controller.exception") {
        return [{
          trace: event.payload.call
        }]
      } else {
        return []
      }        
    }));    

    cacheCalls.value.set(requestId, newEvents.flatMap((event) => {
      if (event.name.startsWith("cache_") && event.name.endsWith(".active_support")) {
        return [{
          type: event.payload.type,
          key: event.payload.key,
          hit: event.payload.hit,
          options: event.payload.options,
          duration: event.duration,
          filename: event.payload.filename,
          line: event.payload.line,
        }]
      } else {
        return []
      }        
    }));
  }

  function clear() {
    actions.value = new Map();
    activeRecordQueries.value = new Map();
    actionViewRenders.value = new Map();
    logEntries.value = new Map();
    exceptionStacktraces.value = new Map();
    cacheCalls.value = new Map();
    selectedRequest.value = null;
  }

  return { 
    requests, 
    selectedRequest,
    selectedActiveRecordQueries, 
    selectedParams,
    selectedActionViewRenders,
    selectedLogEntries,
    selectedExceptionStacktraces,
    selectedCacheCalls,
    pushEvents,
    clear
  }
})

/** Deep-clone a request fixture `{ request_id, events }`. */
export function deepClone(req) {
  return structuredClone(req)
}

/** Return a clone with a new `request_id`. */
export function withRequestId(req, id) {
  const clone = deepClone(req)
  clone.request_id = id
  return clone
}

/**
 * Scale timed event durations (and matching `end` / runtimes on process_action).
 * Log events with duration 0 are left alone.
 */
export function scaleTimedEvents(req, factor) {
  const clone = deepClone(req)
  const f = Number(factor) || 1
  clone.events = clone.events.map((ev) => {
    const next = { ...ev, payload: ev.payload ? { ...ev.payload } : ev.payload }
    const dur = Number(next.duration) || 0
    if (dur > 0) {
      const scaled = dur * f
      if (typeof next.time === 'number' && typeof next.end === 'number' && next.end > 0) {
        next.end = next.time + scaled
      }
      next.duration = scaled
    }
    if (next.name === 'process_action.action_controller' && next.payload) {
      if (typeof next.payload.db_runtime === 'number') {
        next.payload.db_runtime = next.payload.db_runtime * f
      }
      if (typeof next.payload.view_runtime === 'number') {
        next.payload.view_runtime = next.payload.view_runtime * f
      }
    }
    return next
  })
  return clone
}

/**
 * Insert SQL (or other) events before the first `process_action.action_controller`.
 * Falls back to appending before the last event if no process_action is found.
 */
export function injectSqlEvents(req, sqlEvents, { beforeProcessAction = true } = {}) {
  const clone = deepClone(req)
  const extra = Array.isArray(sqlEvents) ? sqlEvents.map((e) => structuredClone(e)) : []
  if (!extra.length) return clone

  const events = [...clone.events]
  let idx = -1
  if (beforeProcessAction) {
    idx = events.findIndex((e) => e.name === 'process_action.action_controller')
  }
  if (idx < 0) idx = Math.max(0, events.length - 1)
  events.splice(idx, 0, ...extra)
  clone.events = events
  return clone
}

/** Minimal `sql.active_record` event in meta_request shape. */
export function makeSqlEvent({
  sql,
  name = 'SQL',
  duration = 1,
  binds = [],
  time = Date.now(),
  filename = '/app/models/application_record.rb',
  line = 1,
  method = 'load',
  transactionId = 'fixture-tx',
} = {}) {
  const dur = Number(duration) || 0
  return {
    name: 'sql.active_record',
    payload: {
      sql,
      name,
      binds: 'Not JSON Encodable',
      type_casted_binds: binds,
      statement_name: null,
      async: false,
      connection: 'Not JSON Encodable',
      filename,
      line,
      method,
    },
    time,
    transaction_id: transactionId,
    end: time + dur,
    cpu_time_start: 0.0,
    cpu_time_finish: 0.0,
    allocation_count_start: 0,
    allocation_count_finish: 0,
    duration: dur,
  }
}

/** Minimal `process_action.action_controller` event. */
export function makeProcessAction({
  controller,
  action,
  method = 'GET',
  path = '/',
  status = 200,
  format = 'html',
  params = {},
  duration = 20,
  dbRuntime = 0,
  viewRuntime = 0,
  time = Date.now(),
  transactionId = 'fixture-tx',
  exception = null,
} = {}) {
  const dur = Number(duration) || 0
  const payload = {
    controller,
    action,
    request: 'Not JSON Encodable',
    params: {
      controller: String(controller || '').replace(/Controller$/, '').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(),
      action,
      ...params,
    },
    headers: {
      REQUEST_METHOD: method,
      REQUEST_PATH: path,
      PATH_INFO: path,
      HTTP_HOST: 'localhost:3000',
      SERVER_NAME: 'localhost',
      SERVER_PORT: '3000',
    },
    format,
    method,
    path,
    response: 'Not JSON Encodable',
    status,
    view_runtime: viewRuntime,
    db_runtime: dbRuntime,
  }
  if (exception) {
    const [klass, message] = Array.isArray(exception) ? exception : [String(exception), String(exception)]
    payload.exception = [klass, message]
    payload.exception_object = message
  }
  return {
    name: 'process_action.action_controller',
    payload,
    time,
    transaction_id: transactionId,
    end: time + dur,
    cpu_time_start: 0.0,
    cpu_time_finish: 0.0,
    allocation_count_start: 0,
    allocation_count_finish: 0,
    duration: dur,
  }
}

/** `render_template` / `render_partial.action_view` event. */
export function makeViewEvent({
  kind = 'template',
  identifier,
  layout = null,
  duration = 1,
  time = Date.now(),
  transactionId = 'fixture-tx',
  locals = {},
  cacheHit = null,
} = {}) {
  const dur = Number(duration) || 0
  const isPartial = kind === 'partial'
  return {
    name: isPartial ? 'render_partial.action_view' : 'render_template.action_view',
    payload: {
      identifier,
      layout: isPartial ? null : layout,
      locals,
      ...(isPartial ? { cache_hit: cacheHit } : {}),
    },
    time,
    transaction_id: transactionId,
    end: time + dur,
    cpu_time_start: 0.0,
    cpu_time_finish: 0.0,
    allocation_count_start: 0,
    allocation_count_finish: 0,
    duration: dur,
  }
}

/** `cache_*.active_support` event (read / write / delete / exist / generate). */
export function makeCacheEvent({
  type = 'read',
  key,
  hit = undefined,
  duration = 0.05,
  time = Date.now(),
  transactionId = 'fixture-tx',
  filename = '/app/controllers/application_controller.rb',
  line = 1,
  method = 'cache',
  store = 'ActiveSupport::Cache::MemoryStore',
} = {}) {
  const dur = Number(duration) || 0
  const payload = {
    key,
    type,
    options: {
      store,
      compress: false,
      compress_threshold: 1024,
    },
    filename,
    line,
    method,
  }
  if (type === 'read' && hit !== undefined) payload.hit = hit
  return {
    name: `cache_${type}.active_support`,
    payload,
    time,
    transaction_id: transactionId,
    end: time + dur,
    cpu_time_start: 0.0,
    cpu_time_finish: 0.0,
    allocation_count_start: 0,
    allocation_count_finish: 0,
    duration: dur,
  }
}

/** `meta_request.log` event (only entries with `message` show in Log tab). */
export function makeLogEvent({
  message,
  level = 'info',
  filename = '/app/controllers/application_controller.rb',
  line = 1,
  method = 'call',
} = {}) {
  return {
    name: 'meta_request.log',
    payload: {
      filename,
      line,
      method,
      message,
      level,
    },
    time: 0.0,
    transaction_id: 0,
    end: 0.0,
    cpu_time_start: 0.0,
    cpu_time_finish: 0.0,
    allocation_count_start: 0,
    allocation_count_finish: 0,
    duration: 0.0,
  }
}

/**
 * ActiveRecord debug log pair (same shape as QuotesController#update captures):
 *   bold cyan "Name (X.Yms)" + colored SQL + optional binds
 *   source arrow "↳ app/...:line:in `method'"
 */
export function makeSqlDebugLogs({
  filename,
  line,
  method,
  typeName,
  durationMs,
  sql,
  bindPairs = [],
  sqlColor = '34',
} = {}) {
  const rel = String(filename || '').replace(/^\//, '')
  const bindsSuffix = bindPairs.length ? `  ${JSON.stringify(bindPairs)}` : ''
  const durLabel = Number(durationMs).toFixed(1)
  return [
    makeLogEvent({
      message: `  \u001b[1m\u001b[36m${typeName} (${durLabel}ms)\u001b[0m  \u001b[1m\u001b[${sqlColor}m${sql}\u001b[0m${bindsSuffix}`,
      level: 'debug',
      filename,
      line,
      method,
    }),
    makeLogEvent({
      message: `  ↳ ${rel}:${line}:in \`${method}'`,
      level: 'debug',
      filename,
      line,
      method,
    }),
  ]
}

/**
 * Exception events for the Error tab.
 * Emits one meta_request exception event per line (headline + each stack frame),
 * matching real captures like DiagramsController#thumbnail.
 */
export function makeExceptionEvents({
  klass,
  message,
  frames = [],
} = {}) {
  const headline = `${klass} (${message})`
  const lines = [headline, ...frames].filter(Boolean)
  return lines.map((call) => ({
    name: 'process_action.action_controller.exception',
    payload: { call },
    time: 0.0,
    transaction_id: null,
    end: 0.0,
    cpu_time_start: 0.0,
    cpu_time_finish: 0.0,
    allocation_count_start: 0,
    allocation_count_finish: 0,
    duration: 0.0,
  }))
}

/**
 * Patch the first `process_action.action_controller` payload (params, path, status, etc.).
 * `patch` may be an object or a mutator `(payload) => void`.
 */
export function patchProcessAction(req, patch) {
  const clone = deepClone(req)
  const ev = clone.events.find((e) => e.name === 'process_action.action_controller')
  if (!ev?.payload) return clone
  if (typeof patch === 'function') {
    patch(ev.payload)
  } else if (patch && typeof patch === 'object') {
    Object.assign(ev.payload, patch)
    if (patch.params) {
      ev.payload.params = { ...ev.payload.params, ...patch.params }
    }
    if (patch.path) {
      ev.payload.path = patch.path
      if (ev.payload.headers) {
        ev.payload.headers = {
          ...ev.payload.headers,
          REQUEST_PATH: patch.path,
          PATH_INFO: patch.path,
          REQUEST_URI: patch.path,
          ORIGINAL_FULLPATH: patch.path,
        }
      }
    }
  }
  return clone
}

/** Build a full `{ request_id, events }` fixture from a flat event list. */
export function makeRequest(requestId, events) {
  return { request_id: requestId, events }
}

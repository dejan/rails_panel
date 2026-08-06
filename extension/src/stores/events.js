import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { withExclusiveDurations, sumExclusive } from '../components/utils/timing'
import { annotateQueryRepeats, nPlusOneGroups, normalizeSql, isMetaSqlType, isSelectLikeSql, annotateSqlNearMatches, collapseSqlNearMatches } from '../components/utils/sqlPatterns'
import { useSettingsStore } from './settings'

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
  const timelineSpans = ref(new Map());
  /** Raw meta_request events per request — needed for faithful JSON export. */
  const rawEventsByRequest = ref(new Map());
  // Highlight a detail-tab row after navigating from Timeline
  const detailHighlightKeys = ref([])

  /** Compare slots: A = baseline, B = candidate. */
  const compareAId = ref(null)
  const compareBId = ref(null)
  /** Bumped when UI should focus the Compare tab. */
  const compareOpenNonce = ref(0)

  const requests = computed(() => Array.from(actions.value.values()));
  const requestCount = computed(() => actions.value.size);

  function normalizeRequestId(requestId) {
    if (requestId != null && typeof requestId === 'object' && requestId.value != null) {
      return String(requestId.value).trim()
    }
    return String(requestId ?? '').trim()
  }

  function allocateRequestId(requestId) {
    const id = normalizeRequestId(requestId)
    if (id && id !== 'undefined' && id !== 'null') return id
    const stamp = Date.now().toString(36)
    const rand = Math.random().toString(36).slice(2, 8)
    return `req:${stamp}:${rand}`
  }

  const selectedActiveRecordQueries = computed(() => {
    if (!selectedRequest.value) return undefined
    return activeRecordQueries.value.get(selectedRequest.value.id)
  });
  const selectedActionViewRenders = computed(() => {
    if (!selectedRequest.value) return undefined
    return actionViewRenders.value.get(selectedRequest.value.id)
  });
  const selectedLogEntries = computed(() => {
    if (!selectedRequest.value) return undefined
    return logEntries.value.get(selectedRequest.value.id)
  });
  const selectedExceptionStacktraces = computed(() => {
    if (!selectedRequest.value) return undefined
    return exceptionStacktraces.value.get(selectedRequest.value.id)
  });
  const selectedCacheCalls = computed(() => {
    if (!selectedRequest.value) return undefined
    return cacheCalls.value.get(selectedRequest.value.id)
  });
  const selectedParams = computed(() => selectedRequest.value?.params);
  const selectedTimeline = computed(() => {
    if (!selectedRequest.value) return null
    return timelineSpans.value.get(selectedRequest.value.id) || null
  });

  function setDetailHighlight(keys) {
    detailHighlightKeys.value = Array.isArray(keys) ? keys.filter(Boolean) : keys ? [keys] : []
  }

  function clearDetailHighlight() {
    detailHighlightKeys.value = []
  }

  function isDetailHighlighted(sourceKey) {
    if (!sourceKey || !detailHighlightKeys.value.length) return false
    return detailHighlightKeys.value.includes(sourceKey)
  }

  function deleteRequestData(requestId) {
    const id = normalizeRequestId(requestId)
    actions.value.delete(id)
    activeRecordQueries.value.delete(id)
    actionViewRenders.value.delete(id)
    logEntries.value.delete(id)
    exceptionStacktraces.value.delete(id)
    cacheCalls.value.delete(id)
    timelineSpans.value.delete(id)
    rawEventsByRequest.value.delete(id)
    if (compareAId.value === id) compareAId.value = null
    if (compareBId.value === id) compareBId.value = null
  }

  function pruneToCap(cap) {
    const max = Math.max(10, Math.round(Number(cap) || 100))
    while (actions.value.size > max) {
      const oldestId = actions.value.keys().next().value
      if (oldestId == null) break
      deleteRequestData(oldestId)
      if (selectedRequest.value?.id === oldestId) {
        const remaining = Array.from(actions.value.values())
        selectedRequest.value = remaining[remaining.length - 1] || null
      }
    }
  }

  function pushEvents(requestId, newEvents, autoReselect = true, options = {}) {
    clearDetailHighlight()
    const settings = useSettingsStore()
    const id = allocateRequestId(requestId)
    const isExternal = !!options.isExternal
    const actionEvent = newEvents.find((event) => event.name == "process_action.action_controller")
    if (!actionEvent) {
      console.warn('rails_panel: skip request without process_action', id)
      return null
    }
    const status = Number(actionEvent.payload.status) || 200
    const hasException = newEvents.some(
      (event) => event.name === 'process_action.action_controller.exception'
    )

    const queries = newEvents.flatMap((event) => {
      if (event.name == "sql.active_record" && event.payload.name != "SCHEMA" && event.payload.name != "EXPLAIN") {
        return [{
          location: event.payload.filename,
          line: event.payload.line,
          type: event.payload.name,
          query: event.payload.sql,
          binds: event.payload.type_casted_binds,
          duration: event.duration,
          time: event.time,
          end: event.end,
          sourceKey: `db:${event.time}`,
        }]
      } else {
        return []
      }
    })

    const annotated = annotateQueryRepeats(queries, { nPlusOneMin: settings.nPlusOneMin })
    const n1Groups = nPlusOneGroups(annotated, { nPlusOneMin: settings.nPlusOneMin })

    const action = {
      id,
      name: "process_action.action_controller",
      status,
      action: actionEvent.payload.controller + "#" + actionEvent.payload.action,
      method: actionEvent.payload.method,
      format: actionEvent.payload.format,
      duration: actionEvent.duration,
      time: actionEvent.time,
      end: actionEvent.end,
      dbRuntime: actionEvent.payload.db_runtime,
      viewRuntime: actionEvent.payload.view_runtime,
      params: Object.entries(actionEvent.payload.params || {}).map(([name, value]) => ({ name, value }) ),
      hasError: status >= 400 || hasException,
      hasException,
      hasNPlusOne: n1Groups.length > 0,
      nPlusOnePatterns: n1Groups.length,
      nPlusOneQueries: n1Groups.reduce((acc, g) => acc + g.count, 0),
      isExternal,
    }
    actions.value.set(id, action);
    
    if (actions.value.size == 1 || autoReselect) {
      selectedRequest.value = action;
    }

    rawEventsByRequest.value.set(id, newEvents)
    activeRecordQueries.value.set(id, queries);

    actionViewRenders.value.set(
      id,
      withExclusiveDurations(
        newEvents.flatMap((event) => {
          if (event.name == "render_template.action_view" || event.name == "render_partial.action_view") {
            return [{
              view: event.payload.identifier,
              layout: event.payload.layout,
              duration: event.duration,
              time: event.time,
              end: event.end,
              kind: event.name === "render_partial.action_view" ? "partial" : "template",
              sourceKey: `view:${event.time}`,
            }]
          } else {
            return []
          }
        })
      )
    );

    logEntries.value.set(id, newEvents.flatMap((event) => {
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

    exceptionStacktraces.value.set(id, (() => {
      let errorIndex = 0
      return newEvents.flatMap((event) => {
        if (event.name != "process_action.action_controller.exception") return []
        // One UI frame per line (supports multiline `call` payloads).
        const lines = String(event.payload?.call || '')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
        return lines.map((trace) => ({
          trace,
          sourceKey: `error:${errorIndex++}`,
        }))
      })
    })());    

    cacheCalls.value.set(id, newEvents.flatMap((event) => {
      if (event.name.startsWith("cache_") && event.name.endsWith(".active_support")) {
        return [{
          type: event.payload.type,
          key: event.payload.key,
          hit: event.payload.hit,
          options: event.payload.options,
          duration: event.duration,
          time: event.time,
          end: event.end,
          filename: event.payload.filename,
          line: event.payload.line,
          sourceKey: `cache:${event.time}`,
        }]
      } else {
        return []
      }        
    }));

    timelineSpans.value.set(id, buildTimeline(actionEvent, newEvents));
    pruneToCap(settings.requestCap)
    return action
  }

  function buildTimeline(actionEvent, events) {
    const origin = Number(actionEvent.time) || 0
    const totalMs = Math.max(
      Number(actionEvent.duration) || 0,
      origin && actionEvent.end ? Number(actionEvent.end) - origin : 0,
      0.001
    )

    const spans = []

    const status = Number(actionEvent.payload.status) || 200
    spans.push({
      id: 'request',
      category: 'request',
      label: `${actionEvent.payload.controller}#${actionEvent.payload.action}`,
      detail: actionEvent.payload.path || '',
      startMs: 0,
      durationMs: totalMs,
      status,
      hasError: status >= 500,
    })

    const sqlEvents = []
    const cacheEvents = []

    for (const event of events) {
      if (!hasTiming(event)) continue

      const startMs = Math.max(0, Number(event.time) - origin)
      const durationMs = Math.max(
        Number(event.duration) || 0,
        event.end ? Number(event.end) - Number(event.time) : 0
      )
      if (durationMs <= 0 && event.name !== 'process_action.action_controller') continue

      if (event.name === 'sql.active_record') {
        if (event.payload.name === 'SCHEMA' || event.payload.name === 'EXPLAIN') continue
        sqlEvents.push({
          name: event.payload.name || 'SQL',
          sql: event.payload.sql || '',
          startMs,
          durationMs,
          endMs: startMs + durationMs,
          sourceKey: `db:${event.time}`,
          ...callerFromPayload(event.payload),
        })
      } else if (
        event.name === 'render_template.action_view' ||
        event.name === 'render_partial.action_view'
      ) {
        const path = event.payload.identifier || ''
        spans.push({
          id: `view-${spans.length}`,
          category: 'view',
          label: basename(path) || path || 'View',
          detail: path,
          startMs,
          durationMs,
          sourceKey: `view:${event.time}`,
          highlightKeys: [`view:${event.time}`],
        })
      } else if (event.name.startsWith('cache_') && event.name.endsWith('.active_support')) {
        const type = event.payload.type || 'cache'
        const key = event.payload.key != null ? String(event.payload.key) : ''
        const hit = event.payload.hit
        let label = type
        if (type === 'read' && hit === true) label = 'read hit'
        else if (type === 'read' && hit === false) label = 'read miss'
        if (key) label = `${label} · ${key}`
        const sourceKey = `cache:${event.time}`
        const caller = callerFromPayload(event.payload)

        cacheEvents.push({
          id: `cache-${cacheEvents.length}`,
          sortKey: 100000 + cacheEvents.length,
          category: 'cache',
          label,
          detail: key
            ? `${type}${hit === true ? ' hit' : hit === false ? ' miss' : ''} · ${key}`
            : String(type),
          startMs,
          durationMs,
          nestDepth: 0,
          sourceKey,
          highlightKeys: [sourceKey],
          groupStartMs: startMs,
          ...caller,
        })
      }
    }

    spans.push(...mergeSqlAndCacheSpans(buildSqlSpans(sqlEvents), cacheEvents))

    const exceptionSpan = buildExceptionSpan(actionEvent, events, totalMs)
    if (exceptionSpan) {
      spans.push(exceptionSpan)
      const requestSpan = spans.find((s) => s.category === 'request')
      if (requestSpan) requestSpan.hasError = true
    }

    const spansAll = finalizeTimelineSpans(spans)
    const dbCache = spans.filter((s) => s.category === 'db' || s.category === 'cache')
    const requestViewError = spans.filter(
      (s) => s.category === 'request' || s.category === 'view' || s.category === 'error'
    )
    const spansByCaller = finalizeTimelineSpans([
      ...requestViewError,
      ...groupSqlByCaller(dbCache, { by: 'method' }),
    ])
    const spansByCallerFile = finalizeTimelineSpans([
      ...requestViewError,
      ...groupSqlByCaller(dbCache, { by: 'file' }),
    ])

    const dbRuntime = Number(actionEvent.payload.db_runtime) || sumCategory(spansAll, 'db')
    const viewRuntime = sumExclusive(spansAll.filter((s) => s.category === 'view'))
    const cacheRuntime = sumCategory(spansAll, 'cache')
    const otherRuntime = Math.max(0, totalMs - dbRuntime - viewRuntime - cacheRuntime)
    // Type buckets must match the header totals (Rails db_runtime, view self-sum, etc.).
    const spansByType = buildSpansByType(spansAll, {
      view: viewRuntime,
      db: dbRuntime,
      cache: cacheRuntime,
    })

    return {
      totalMs,
      dbRuntime,
      viewRuntime,
      cacheRuntime,
      otherRuntime,
      spans: spansAll,
      spansByCaller,
      spansByCallerFile,
      spansByType,
    }
  }

  function finalizeTimelineSpans(spans) {
    const viewSpans = withExclusiveDurations(
      spans.filter((s) => s.category === 'view'),
      {
        getStart: (s) => s.startMs,
        getDuration: (s) => s.durationMs,
      }
    )
    const viewById = new Map(viewSpans.map((s) => [s.id, s]))
    const resolved = spans.map((span) => {
      const exclusive = viewById.get(span.id)
      if (!exclusive) {
        return {
          ...span,
          durationInclusiveMs: span.durationMs,
          durationExclusiveMs: span.durationMs,
          nestDepth: span.nestDepth || 0,
        }
      }
      return {
        ...span,
        durationInclusiveMs: exclusive.durationInclusive,
        durationExclusiveMs: exclusive.durationExclusive,
        nestDepth: exclusive.nestDepth,
      }
    })

    resolved.sort((a, b) => {
      if (a.category === 'error' && b.category !== 'error') return 1
      if (b.category === 'error' && a.category !== 'error') return -1
      const groupA = a.groupStartMs ?? a.startMs
      const groupB = b.groupStartMs ?? b.startMs
      if (groupA !== groupB) return groupA - groupB
      if (a.startMs !== b.startMs) return a.startMs - b.startMs
      const depthA = a.nestDepth || 0
      const depthB = b.nestDepth || 0
      if (depthA !== depthB) return depthA - depthB
      if (depthA > 0) {
        return (a.sortKey ?? 0) - (b.sortKey ?? 0)
      }
      if (a.durationMs !== b.durationMs) return b.durationMs - a.durationMs
      return (a.sortKey ?? 0) - (b.sortKey ?? 0)
    })

    return resolved
  }

  function hasTiming(event) {
    return event && Number(event.time) > 0 && (Number(event.duration) > 0 || Number(event.end) > Number(event.time))
  }

  function callerFromPayload(payload) {
    const methodRaw = payload?.method != null ? String(payload.method) : ''
    const filename = payload?.filename != null ? String(payload.filename) : ''
    const line = payload?.line
    if (!methodRaw && !filename) {
      return {
        callerKey: null,
        callerLabel: null,
        callerDetail: null,
        callerFileKey: null,
        callerFileLabel: null,
      }
    }
    const file = basename(filename)
    const fileStem = file
      .replace(/\.rb$/i, '')
      .replace(/\.html\.erb$/i, '')
      .replace(/\.erb$/i, '')
    let method = methodRaw
    if (method.startsWith('block in ')) method = method.slice('block in '.length)
    // Always prefer file#method so generic names (map, index) stay useful.
    let callerLabel = 'caller'
    if (fileStem && method) callerLabel = `${fileStem}#${method}`
    else if (method) callerLabel = method
    else if (fileStem) callerLabel = fileStem
    const loc = file ? (line != null ? `${file}:${line}` : file) : ''
    const callerDetail = [loc, methodRaw || method].filter(Boolean).join(' · ')
    const callerKey = `${filename}#${methodRaw || method}`
    const callerFileKey = filename || null
    const callerFileLabel = fileStem || file || 'file'
    return { callerKey, callerLabel, callerDetail, callerFileKey, callerFileLabel }
  }

  function isTransactionBegin(sqlEvent) {
    return sqlEvent.name === 'TRANSACTION' && /begin/i.test(sqlEvent.sql || '')
  }

  function isTransactionEnd(sqlEvent) {
    return sqlEvent.name === 'TRANSACTION' && /(commit|rollback)/i.test(sqlEvent.sql || '')
  }

  function transactionChildLabel(sqlEvent) {
    if (isTransactionBegin(sqlEvent)) return 'begin'
    if (isTransactionEnd(sqlEvent)) {
      return /rollback/i.test(sqlEvent.sql || '') ? 'rollback' : 'commit'
    }
    return sqlEvent.name || 'SQL'
  }

  /**
   * ActiveRecord emits TRANSACTION begin/commit as tiny sibling events — the
   * UPDATE is not time-contained in either. Group begin…commit and nest the
   * statements that happen in between (plus begin/commit themselves).
   *
   * Instrumentation sometimes stamps UPDATE.time slightly before BEGIN.time;
   * we keep event order and clamp starts so begin always precedes siblings.
   */
  function buildSqlSpans(sqlEvents) {
    const out = []
    let i = 0
    let seq = 0

    while (i < sqlEvents.length) {
      const current = sqlEvents[i]
      if (!isTransactionBegin(current)) {
        out.push({
          id: `sql-${seq}`,
          sortKey: seq++,
          category: 'db',
          label: current.name || 'SQL',
          detail: current.sql || '',
          startMs: current.startMs,
          durationMs: current.durationMs,
          nestDepth: 0,
          sourceKey: current.sourceKey,
          highlightKeys: [current.sourceKey],
          callerKey: current.callerKey,
          callerLabel: current.callerLabel,
          callerDetail: current.callerDetail,
          callerFileKey: current.callerFileKey,
          callerFileLabel: current.callerFileLabel,
          groupStartMs: current.startMs,
        })
        i += 1
        continue
      }

      const group = [current]
      i += 1
      while (i < sqlEvents.length && !isTransactionEnd(sqlEvents[i])) {
        group.push(sqlEvents[i])
        i += 1
      }
      if (i < sqlEvents.length && isTransactionEnd(sqlEvents[i])) {
        group.push(sqlEvents[i])
        i += 1
      }

      const groupStart = Math.min(...group.map((g) => g.startMs))
      const groupEnd = Math.max(...group.map((g) => g.endMs))
      const workMs = group.reduce((acc, g) => acc + (Number(g.durationMs) || 0), 0)
      const wallMs = Math.max(0, groupEnd - groupStart)
      const childKeys = group.map((g) => g.sourceKey).filter(Boolean)
      const caller = group.find((g) => g.callerKey) || group[0]
      out.push({
        id: `sql-tx-${seq}`,
        sortKey: seq++,
        category: 'db',
        label: 'TRANSACTION',
        detail: group.map((g) => g.sql).filter(Boolean).join(' → '),
        startMs: groupStart,
        // Label = SQL work; bar uses durationWallMs (BEGIN→COMMIT open time).
        durationMs: Math.max(0, workMs),
        durationWallMs: wallMs,
        nestDepth: 0,
        highlightKeys: childKeys,
        isTransactionGroup: true,
        callerKey: caller.callerKey,
        callerLabel: caller.callerLabel,
        callerDetail: caller.callerDetail,
        callerFileKey: caller.callerFileKey,
        callerFileLabel: caller.callerFileLabel,
        groupStartMs: groupStart,
      })

      // Non-decreasing starts in event order: begin first, then Update, then commit.
      let lastStart = groupStart
      for (let j = 0; j < group.length; j++) {
        const child = group[j]
        const startMs = j === 0 ? groupStart : Math.max(child.startMs, lastStart)
        lastStart = startMs
        out.push({
          id: `sql-${seq}`,
          sortKey: seq++,
          category: 'db',
          label: transactionChildLabel(child),
          detail: child.sql || '',
          startMs,
          durationMs: child.durationMs,
          nestDepth: 1,
          sourceKey: child.sourceKey,
          highlightKeys: [child.sourceKey],
          groupStartMs: groupStart,
        })
      }
    }

    return out
  }

  /**
   * Wrap consecutive top-level SQL/cache blocks that share the same Ruby caller
   * under a parent row. `by: 'method'` → file#method; `by: 'file'` → file only.
   */
  function groupSqlByCaller(spans, { by = 'method' } = {}) {
    const keyOf = (span) =>
      by === 'file' ? span.callerFileKey || span.callerKey || null : span.callerKey || null
    const labelOf = (span) =>
      by === 'file'
        ? span.callerFileLabel || span.callerLabel || 'file'
        : span.callerLabel || 'caller'
    const idPrefix = by === 'file' ? 'sql-caller-file' : 'sql-caller'

    const blocks = []
    let i = 0
    while (i < spans.length) {
      const head = spans[i]
      const headDepth = head.nestDepth || 0
      const items = [head]
      i += 1
      while (i < spans.length && (spans[i].nestDepth || 0) > headDepth) {
        items.push(spans[i])
        i += 1
      }
      blocks.push({
        head,
        items,
        callerKey: keyOf(head),
        callerLabel: labelOf(head),
        callerDetail: head.callerDetail || null,
      })
    }

    const out = []
    let seq = 0
    let b = 0
    while (b < blocks.length) {
      const key = blocks[b].callerKey
      if (!key) {
        out.push(...blocks[b].items)
        b += 1
        continue
      }

      let end = b + 1
      while (end < blocks.length && blocks[end].callerKey === key) end += 1
      const run = blocks.slice(b, end)

      if (run.length === 1) {
        out.push(...run[0].items)
        b = end
        continue
      }

      const tops = run.map((block) => block.head)
      const nested = run.flatMap((block) => block.items)
      const startMs = Math.min(...tops.map((t) => t.startMs))
      const endMs = Math.max(
        ...tops.map((t) => t.startMs + (t.durationWallMs ?? t.durationMs))
      )
      const leaves = nested.filter((s) => s.sourceKey)
      const workMs = leaves.reduce((acc, s) => acc + (Number(s.durationMs) || 0), 0)
      const wallMs = Math.max(0, endMs - startMs)
      const highlightKeys = nested.flatMap((s) => s.highlightKeys || []).filter(Boolean)
      const cats = [...new Set(tops.map((t) => t.category).filter(Boolean))]
      // Prefer real child kinds: cache-only groups must not look like Database.
      let category = 'db'
      if (cats.length === 1) category = cats[0]
      else if (cats.includes('db') && cats.includes('cache')) {
        const dbMs = nested
          .filter((s) => s.category === 'db' && s.sourceKey)
          .reduce((acc, s) => acc + (Number(s.durationMs) || 0), 0)
        const cacheMs = nested
          .filter((s) => s.category === 'cache' && s.sourceKey)
          .reduce((acc, s) => acc + (Number(s.durationMs) || 0), 0)
        category = cacheMs > dbMs ? 'cache' : 'db'
      } else if (cats[0]) {
        category = cats[0]
      }

      out.push({
        id: `${idPrefix}-${seq++}`,
        sortKey: tops[0].sortKey,
        category,
        label: run[0].callerLabel || (by === 'file' ? 'file' : 'caller'),
        detail: run[0].callerDetail || '',
        startMs,
        // Label = leaf work; bar uses durationWallMs (first→last open time).
        durationMs: Math.max(0, workMs),
        durationWallMs: wallMs,
        nestDepth: 0,
        highlightKeys,
        isCallerGroup: true,
        groupStartMs: startMs,
      })

      for (const item of nested) {
        out.push({
          ...item,
          nestDepth: (item.nestDepth || 0) + 1,
          groupStartMs: startMs,
        })
      }
      b = end
    }

    return out
  }

  function splitSpanBlocks(spans) {
    const blocks = []
    let i = 0
    while (i < spans.length) {
      const head = spans[i]
      const headDepth = head.nestDepth || 0
      const items = [head]
      i += 1
      while (i < spans.length && (spans[i].nestDepth || 0) > headDepth) {
        items.push(spans[i])
        i += 1
      }
      blocks.push({ head, items })
    }
    return blocks
  }

  /** Interleave SQL blocks (keeping TX children) with cache rows by start time. */
  function mergeSqlAndCacheSpans(sqlSpans, cacheSpans) {
    const blocks = [
      ...splitSpanBlocks(sqlSpans),
      ...cacheSpans.map((span) => ({ head: span, items: [span] })),
    ]
    blocks.sort((a, b) => {
      if (a.head.startMs !== b.head.startMs) return a.head.startMs - b.head.startMs
      return (a.head.sortKey ?? 0) - (b.head.sortKey ?? 0)
    })
    return blocks.flatMap((block) => block.items)
  }

  /**
   * Macro view: Request → View/Database/Cache buckets (caller groups unwrapped),
   * preserving TRANSACTION nesting inside Database.
   * @param {{ view?: number, db?: number, cache?: number }} runtimes
   *   Header totals — type-group labels must match these; bars use wall open time.
   */
  function buildSpansByType(spans, runtimes = {}) {
    const request = spans.filter((s) => s.category === 'request')
    const error = spans.filter((s) => s.category === 'error')
    const items = spans.filter(
      (s) =>
        !s.isCallerGroup &&
        s.category !== 'request' &&
        s.category !== 'error'
    )

    const labels = { view: 'View', db: 'Database', cache: 'Cache' }
    const buckets = []

    for (const cat of ['view', 'db', 'cache']) {
      const catItems = items.filter((s) => s.category === cat)
      if (!catItems.length) continue

      const minDepth = Math.min(...catItems.map((s) => s.nestDepth || 0))
      const normalized = catItems.map((s, index) => ({
        ...s,
        id: `type-${cat}-${s.id}`,
        nestDepth: (s.nestDepth || 0) - minDepth + 1,
        sortKey: index,
        groupStartMs: undefined,
      }))

      const leaves = normalized.filter((s) => s.sourceKey)
      const leafSum = leaves.reduce((acc, s) => {
        const ms =
          cat === 'view'
            ? (s.durationExclusiveMs ?? s.durationExclusive ?? s.durationMs)
            : s.durationMs
        return acc + (Number(ms) || 0)
      }, 0)
      const totalMs =
        runtimes[cat] != null && Number.isFinite(Number(runtimes[cat]))
          ? Number(runtimes[cat])
          : leafSum
      const startMs = Math.min(...normalized.map((s) => s.startMs))
      const wallEnd = Math.max(
        ...normalized.map(
          (s) => s.startMs + (s.durationWallMs ?? s.durationInclusiveMs ?? s.durationMs ?? 0)
        )
      )
      const wallMs = Math.max(0, wallEnd - startMs)
      const highlightKeys = normalized.flatMap((s) => s.highlightKeys || []).filter(Boolean)
      const count = leaves.length || normalized.length

      buckets.push({
        startMs,
        group: {
          id: `type-group-${cat}`,
          category: cat,
          label: labels[cat],
          detail: `${count} event${count === 1 ? '' : 's'}`,
          startMs,
          // Label matches header work total; bar uses durationWallMs (first→last).
          durationMs: Math.max(0, totalMs),
          durationInclusiveMs: Math.max(0, totalMs),
          durationExclusiveMs: Math.max(0, totalMs),
          durationWallMs: wallMs,
          nestDepth: 0,
          highlightKeys,
          isTypeGroup: true,
          groupStartMs: startMs,
        },
        children: normalized.map((item) => ({
          ...item,
          groupStartMs: startMs,
        })),
      })
    }

    // Order type buckets by when they first appear on the timeline.
    buckets.sort((a, b) => {
      if (a.startMs !== b.startMs) return a.startMs - b.startMs
      return String(a.group.category).localeCompare(String(b.group.category))
    })

    const out = [...request]
    buckets.forEach((bucket, seq) => {
      out.push({
        ...bucket.group,
        sortKey: seq,
      })
      bucket.children.forEach((item, index) => {
        out.push({
          ...item,
          sortKey: seq * 1000 + index,
        })
      })
    })

    out.push(...error)
    return out
  }

  function buildExceptionSpan(actionEvent, events, totalMs) {
    const frames = events
      .filter((e) => e.name === 'process_action.action_controller.exception')
      .flatMap((e) => String(e.payload?.call || '').split('\n'))
      .map((line) => line.trim())
      .filter(Boolean)
    const payloadEx = actionEvent.payload?.exception
    if (!frames.length && !payloadEx) return null

    let label = 'Exception'
    let detail = ''

    if (Array.isArray(payloadEx) && payloadEx.length) {
      label = String(payloadEx[0] || label)
      detail = String(payloadEx[1] || '')
    } else if (frames[0]) {
      const match = frames[0].match(/^([A-Za-z0-9_.:]+)\s*\((.*)\)\s*$/)
      if (match) {
        label = match[1]
        detail = match[2]
      } else {
        label = frames[0].split(':')[0] || frames[0]
        detail = frames[0]
      }
    }

    // Stack frames after the exception headline (which is usually frames[0])
    const stack = frames.filter((frame, index) => {
      if (index === 0 && frame.includes(label)) return false
      return true
    })

    const highlightKeys = frames.map((_, index) => `error:${index}`)

    return {
      id: 'exception',
      category: 'error',
      label,
      detail: detail || label,
      frames: stack,
      startMs: 0,
      durationMs: totalMs,
      isMarker: true,
      highlightKeys,
    }
  }

  function sumCategory(spans, category) {
    return spans
      .filter((s) => s.category === category && s.sourceKey)
      .reduce((acc, s) => acc + (Number(s.durationMs) || 0), 0)
  }

  function basename(path) {
    if (!path) return ''
    const parts = String(path).split(/[/\\]/)
    return parts[parts.length - 1] || path
  }

  function clear() {
    actions.value = new Map();
    activeRecordQueries.value = new Map();
    actionViewRenders.value = new Map();
    logEntries.value = new Map();
    exceptionStacktraces.value = new Map();
    cacheCalls.value = new Map();
    timelineSpans.value = new Map();
    rawEventsByRequest.value = new Map();
    selectedRequest.value = null;
    clearDetailHighlight();
    clearCompare();
  }

  /** Keep only the currently selected request; drop everything else. */
  function clearOlder() {
    const keep = selectedRequest.value
    if (!keep) {
      clear()
      return
    }
    const keepId = keep.id
    const nextActions = new Map()
    nextActions.set(keepId, keep)
    actions.value = nextActions

    const pick = (map) => {
      const next = new Map()
      if (map.has(keepId)) next.set(keepId, map.get(keepId))
      return next
    }
    activeRecordQueries.value = pick(activeRecordQueries.value)
    actionViewRenders.value = pick(actionViewRenders.value)
    logEntries.value = pick(logEntries.value)
    exceptionStacktraces.value = pick(exceptionStacktraces.value)
    cacheCalls.value = pick(cacheCalls.value)
    timelineSpans.value = pick(timelineSpans.value)
    rawEventsByRequest.value = pick(rawEventsByRequest.value)
    clearDetailHighlight()
    if (compareAId.value && compareAId.value !== keepId) compareAId.value = null
    if (compareBId.value && compareBId.value !== keepId) compareBId.value = null
  }

  function compareSlotFor(requestId) {
    if (requestId == null) return null
    const id = normalizeRequestId(
      typeof requestId === 'object' && requestId.id != null ? requestId.id : requestId
    )
    if (!id) return null
    if (compareAId.value === id) return 'A'
    if (compareBId.value === id) return 'B'
    return null
  }

  function clearCompare() {
    compareAId.value = null
    compareBId.value = null
  }

  function swapCompare() {
    const a = compareAId.value
    compareAId.value = compareBId.value
    compareBId.value = a
  }

  function resolveCompareAction(input) {
    if (input == null) return null

    // Row object from the request list
    if (typeof input === 'object' && !Array.isArray(input) && input.id != null) {
      const id = normalizeRequestId(input.id)
      if (id && actions.value.has(id)) return actions.value.get(id)
      // Same object reference as stored in the Map (PrimeVue selection / row slot)
      for (const action of actions.value.values()) {
        if (action === input || normalizeRequestId(action.id) === id) return action
      }
      // Last resort: trust the row if it looks like a stored action
      if (input.action != null || input.status != null) return input
      return null
    }

    const id = normalizeRequestId(input)
    if (!id) return null
    if (actions.value.has(id)) return actions.value.get(id)
    for (const action of actions.value.values()) {
      if (normalizeRequestId(action.id) === id) return action
    }
    return null
  }

  /**
   * Assign request to compare slot.
   * Empty → A; A set → B (opens Compare); both set → replace B.
   * Clicking the same slot again clears that slot.
   * Accepts a request id or a request row object.
   */
  function setCompareSlot(requestIdOrAction) {
    const action = resolveCompareAction(requestIdOrAction)
    if (!action) return null
    const id = normalizeRequestId(action.id)
    if (!id) return null

    // Keep Map keyed by the canonical id when we only had a loose row match.
    if (!actions.value.has(id)) {
      actions.value.set(id, action)
    }

    if (compareAId.value === id) {
      compareAId.value = compareBId.value
      compareBId.value = null
      return { slot: null, opened: false }
    }
    if (compareBId.value === id) {
      compareBId.value = null
      return { slot: null, opened: false }
    }

    if (!compareAId.value) {
      compareAId.value = id
      return { slot: 'A', opened: false }
    }

    compareBId.value = id
    compareOpenNonce.value += 1
    return { slot: 'B', opened: true }
  }

  function summarizeForCompare(requestId) {
    if (requestId == null) return null
    const id = normalizeRequestId(requestId)
    const action = actions.value.get(id)
    if (!action) return null
    const timeline = timelineSpans.value.get(id)
    const queries = activeRecordQueries.value.get(id) || []
    const views = actionViewRenders.value.get(id) || []
    const total = Number(action.duration) || Number(timeline?.totalMs) || 0
    const dbRuntime = Number(timeline?.dbRuntime ?? action.dbRuntime) || 0
    const viewRuntime = Number(timeline?.viewRuntime ?? action.viewRuntime) || 0
    const cacheRuntime = Number(timeline?.cacheRuntime) || 0
    const otherRuntime = timeline != null
      ? Math.max(0, Number(timeline.otherRuntime) || 0)
      : Math.max(0, total - dbRuntime - viewRuntime - cacheRuntime)
    const queryCount = queries.filter((q) => !isMetaSqlType(q.type)).length

    return {
      id,
      action: action.action,
      status: action.status,
      method: action.method,
      format: action.format,
      duration: total,
      isExternal: !!action.isExternal,
      dbRuntime,
      viewRuntime,
      cacheRuntime,
      otherRuntime,
      queryCount,
      nPlusOnePatterns: action.nPlusOnePatterns || 0,
      viewCount: views.length,
    }
  }

  function sqlPatternGroupsFor(requestId) {
    const id = normalizeRequestId(requestId)
    const queries = activeRecordQueries.value.get(id) || []
    const settings = useSettingsStore()
    const nPlusOneMin = settings.nPlusOneMin || 3
    const map = new Map()
    for (const q of queries) {
      if (isMetaSqlType(q.type)) continue
      const pattern = normalizeSql(q.query)
      if (!pattern) continue
      if (!map.has(pattern)) {
        map.set(pattern, {
          pattern,
          sample: q.query,
          binds: q.binds,
          type: q.type,
          count: 0,
          totalMs: 0,
        })
      }
      const g = map.get(pattern)
      g.count += 1
      g.totalMs += Number(q.duration) || 0
      // Prefer a non-empty binds sample when the first occurrence had none
      if ((g.binds == null || (Array.isArray(g.binds) && !g.binds.length)) && q.binds != null) {
        g.binds = q.binds
        g.sample = q.query
      }
    }
    for (const g of map.values()) {
      g.isNPlusOne = g.count >= nPlusOneMin
    }
    return map
  }

  function stableParamValue(value) {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }

  function formatParamDisplay(value) {
    if (value === undefined) return '—'
    if (typeof value === 'string') return value
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }

  /** Parse JSON object/array strings; leave other strings alone. */
  function parseParamValue(value) {
    if (typeof value !== 'string') return value
    const s = value.trim()
    if (!(s.startsWith('{') || s.startsWith('['))) return value
    try {
      return JSON.parse(s)
    } catch {
      return value
    }
  }

  function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  }

  function isNestableParam(value) {
    return Array.isArray(value) || isPlainObject(value)
  }

  /**
   * Flatten nested objects/arrays into leaf paths.
   * e.g. { status: 'x', tags: ['a'] } under "post" → post.status, post.tags[0]
   */
  function flattenParamLeaves(value, prefix = '') {
    const out = new Map()
    const walk = (val, path) => {
      if (Array.isArray(val)) {
        if (val.length === 0) {
          if (path) out.set(path, val)
          return
        }
        val.forEach((item, i) => {
          const child = path ? `${path}[${i}]` : `[${i}]`
          if (isNestableParam(item)) walk(item, child)
          else out.set(child, item)
        })
        return
      }
      if (isPlainObject(val)) {
        const keys = Object.keys(val)
        if (keys.length === 0) {
          if (path) out.set(path, val)
          return
        }
        for (const key of keys) {
          const child = path ? `${path}.${key}` : key
          const item = val[key]
          if (isNestableParam(item)) walk(item, child)
          else out.set(child, item)
        }
        return
      }
      if (path) out.set(path, val)
    }
    walk(value, prefix)
    return out
  }

  function paramRow(name, side, valueA, valueB) {
    return {
      name,
      side,
      isFramework: isFrameworkParam(name),
      valueA: formatParamDisplay(valueA),
      valueB: formatParamDisplay(valueB),
      rawA: valueA,
      rawB: valueB,
    }
  }

  /** All leaf paths for nested params (includes identical leaves for All filter). */
  function expandNestedParamLeaves(rootName, valueA, valueB) {
    const leavesA = flattenParamLeaves(valueA, rootName)
    const leavesB = flattenParamLeaves(valueB, rootName)
    const paths = new Set([...leavesA.keys(), ...leavesB.keys()])
    const rows = []
    for (const path of paths) {
      const hasA = leavesA.has(path)
      const hasB = leavesB.has(path)
      const a = hasA ? leavesA.get(path) : undefined
      const b = hasB ? leavesB.get(path) : undefined
      let side = 'same'
      if (hasA && !hasB) side = 'onlyA'
      else if (!hasA && hasB) side = 'onlyB'
      else if (stableParamValue(a) !== stableParamValue(b)) side = 'changed'
      rows.push(paramRow(path, side, a, b))
    }
    return rows
  }

  function buildParamsDiff(idA, idB) {
    const paramsA = actions.value.get(idA)?.params || []
    const paramsB = actions.value.get(idB)?.params || []
    const mapA = new Map(paramsA.map((p) => [String(p.name), p.value]))
    const mapB = new Map(paramsB.map((p) => [String(p.name), p.value]))
    const names = new Set([...mapA.keys(), ...mapB.keys()])
    const rows = []
    for (const name of names) {
      const hasA = mapA.has(name)
      const hasB = mapB.has(name)
      const rawA = hasA ? mapA.get(name) : undefined
      const rawB = hasB ? mapB.get(name) : undefined
      const valueA = hasA ? parseParamValue(rawA) : undefined
      const valueB = hasB ? parseParamValue(rawB) : undefined

      const nestA = hasA && isNestableParam(valueA)
      const nestB = hasB && isNestableParam(valueB)

      // Nested on both sides (equal or not): expand every leaf so All/Changed/Added/Removed see all paths
      if (nestA && nestB) {
        rows.push(...expandNestedParamLeaves(name, valueA, valueB))
        continue
      }
      if (nestA && !hasB) {
        for (const [path, val] of flattenParamLeaves(valueA, name)) {
          rows.push(paramRow(path, 'onlyA', val, undefined))
        }
        continue
      }
      if (nestB && !hasA) {
        for (const [path, val] of flattenParamLeaves(valueB, name)) {
          rows.push(paramRow(path, 'onlyB', undefined, val))
        }
        continue
      }
      // One side nestable, other scalar/mixed → single top-level row
      if (nestA || nestB) {
        let side = 'changed'
        if (hasA && !hasB) side = 'onlyA'
        else if (!hasA && hasB) side = 'onlyB'
        rows.push(paramRow(name, side, valueA, valueB))
        continue
      }

      if (hasA && hasB && stableParamValue(valueA) === stableParamValue(valueB)) {
        rows.push(paramRow(name, 'same', valueA, valueB))
        continue
      }

      let side = 'same'
      if (hasA && !hasB) side = 'onlyA'
      else if (!hasA && hasB) side = 'onlyB'
      else side = 'changed'
      rows.push(paramRow(name, side, valueA, valueB))
    }
    const sideRank = { changed: 0, onlyB: 1, onlyA: 2, same: 3 }
    rows.sort((x, y) => (sideRank[x.side] - sideRank[y.side]) || x.name.localeCompare(y.name))
    return rows
  }

  /** Rails / form noise that rarely explains SQL regressions. */
  function isFrameworkParam(name) {
    const n = String(name || '')
    if (!n) return true
    const root = n.split(/[.\[]/)[0] || n
    const lower = root.toLowerCase()
    const full = n.toLowerCase()
    if (
      lower === 'controller' ||
      lower === 'action' ||
      lower === 'authenticity_token' ||
      lower === 'utf8' ||
      lower === '_method' ||
      lower === 'commit' ||
      lower === 'format' ||
      lower === 'button'
    ) {
      return true
    }
    // Rails nested authenticity / button helpers
    if (full.endsWith('(authenticity_token)') || full.includes('authenticity_token')) return true
    return false
  }

  function cacheGroupsFor(requestId) {
    const id = normalizeRequestId(requestId)
    const calls = cacheCalls.value.get(id) || []
    const map = new Map()
    for (const c of calls) {
      const key = c.key != null && String(c.key) !== '' ? String(c.key) : '(no key)'
      if (!map.has(key)) {
        map.set(key, {
          key,
          count: 0,
          totalMs: 0,
          hits: 0,
          misses: 0,
          types: new Set(),
        })
      }
      const g = map.get(key)
      g.count += 1
      g.totalMs += Number(c.duration) || 0
      if (c.hit === true) g.hits += 1
      if (c.hit === false) g.misses += 1
      if (c.type) g.types.add(String(c.type))
    }
    for (const g of map.values()) {
      g.typeSummary = Array.from(g.types).sort().join(', ')
    }
    return map
  }

  function viewGroupsFor(requestId) {
    const id = normalizeRequestId(requestId)
    const views = actionViewRenders.value.get(id) || []
    const map = new Map()
    for (const v of views) {
      const path = v.view != null && String(v.view) !== '' ? String(v.view) : '(unknown)'
      if (!map.has(path)) {
        map.set(path, {
          path,
          kind: v.kind || 'template',
          count: 0,
          totalMs: 0,
        })
      }
      const g = map.get(path)
      g.count += 1
      const ms = Number(v.durationExclusive ?? v.duration) || 0
      g.totalMs += ms
      if (v.kind) g.kind = v.kind
    }
    return map
  }

  function exceptionGroupsFor(requestId) {
    const id = normalizeRequestId(requestId)
    const traces = exceptionStacktraces.value.get(id) || []
    const map = new Map()
    traces.forEach((t, index) => {
      let raw = ''
      try {
        if (Array.isArray(t?.trace)) raw = t.trace.map((line) => String(line ?? '')).join('\n')
        else if (t?.trace != null) raw = String(t.trace)
      } catch {
        raw = ''
      }
      const firstLine = raw.split('\n').map((l) => l.trim()).find(Boolean) || `exception #${index + 1}`
      const key = firstLine
      if (!map.has(key)) {
        map.set(key, {
          label: firstLine,
          sample: raw.slice(0, 500),
          count: 0,
        })
      }
      map.get(key).count += 1
    })
    return map
  }

  function mergeCountGroups(mapA, mapB, keyField, labelField) {
    const keys = new Set([...mapA.keys(), ...mapB.keys()])
    const rows = []
    for (const key of keys) {
      const ga = mapA.get(key)
      const gb = mapB.get(key)
      const countA = ga?.count || 0
      const countB = gb?.count || 0
      let side = 'both'
      if (ga && !gb) side = 'onlyA'
      else if (!ga && gb) side = 'onlyB'
      rows.push({
        [keyField]: key,
        [labelField]: gb?.[labelField] || ga?.[labelField] || key,
        side,
        countA,
        countB,
        deltaCount: countB - countA,
        sample: gb?.sample || ga?.sample || '',
        level: gb?.level ?? ga?.level,
      })
    }
    rows.sort((x, y) => Math.abs(y.deltaCount) - Math.abs(x.deltaCount) || String(x[labelField]).localeCompare(String(y[labelField])))
    return rows
  }

  function mergeTimedGroups(mapA, mapB, keyField) {
    const keys = new Set([...mapA.keys(), ...mapB.keys()])
    const rows = []
    for (const key of keys) {
      const ga = mapA.get(key)
      const gb = mapB.get(key)
      const countA = ga?.count || 0
      const countB = gb?.count || 0
      const timeA = ga?.totalMs || 0
      const timeB = gb?.totalMs || 0
      let side = 'both'
      if (ga && !gb) side = 'onlyA'
      else if (!ga && gb) side = 'onlyB'
      rows.push({
        [keyField]: key,
        side,
        countA,
        countB,
        timeA,
        timeB,
        deltaTime: timeB - timeA,
        deltaCount: countB - countA,
        typeSummary: gb?.typeSummary || ga?.typeSummary || '',
        kind: gb?.kind || ga?.kind || '',
        hitsA: ga?.hits || 0,
        hitsB: gb?.hits || 0,
        missesA: ga?.misses || 0,
        missesB: gb?.misses || 0,
        hitChanged:
          (ga?.hits || 0) !== (gb?.hits || 0) ||
          (ga?.misses || 0) !== (gb?.misses || 0),
        deltaHits: (gb?.hits || 0) - (ga?.hits || 0),
        deltaMisses: (gb?.misses || 0) - (ga?.misses || 0),
      })
    }
    rows.sort((x, y) => Math.abs(y.deltaTime) - Math.abs(x.deltaTime) || Math.abs(y.deltaCount) - Math.abs(x.deltaCount))
    return rows
  }

  function waterfallSpansFor(requestId, scaleMs) {
    const id = normalizeRequestId(requestId)
    const tl = timelineSpans.value.get(id)
    const scale = Math.max(Number(scaleMs) || 0, 0.001)
    if (!tl?.spans?.length) return []
    return tl.spans
      .filter((s) => s.category && s.category !== 'request')
      .filter((s) => (s.nestDepth || 0) === 0)
      .map((s) => {
        const startMs = Math.max(0, Number(s.startMs) || 0)
        const durationMs = Math.max(
          0,
          Number(s.durationWallMs ?? s.durationInclusiveMs ?? s.durationMs) || 0
        )
        const leftPct = Math.min(100, (startMs / scale) * 100)
        const widthPct = Math.max(0.15, Math.min(100 - leftPct, (durationMs / scale) * 100))
        return {
          id: s.id,
          category: s.category,
          label: s.label || s.category,
          detail: s.detail || '',
          startMs,
          durationMs,
          leftPct,
          widthPct,
          hasError: !!s.hasError || s.category === 'error',
        }
      })
      .filter((s) => s.durationMs > 0.05 || s.category === 'error')
      .slice(0, 120)
  }

  function barClassForCategory(category) {
    switch (category) {
      case 'view':
        return 'bg-amber-500/90 dark:bg-amber-400/90'
      case 'db':
        return 'bg-sky-500/90 dark:bg-sky-400/90'
      case 'cache':
        return 'bg-emerald-500/90 dark:bg-emerald-400/90'
      case 'error':
        return 'bg-red-500/90 dark:bg-red-400/90'
      default:
        return 'bg-surface-400/80 dark:bg-surface-500/80'
    }
  }

  function formatSignedMsText(ms) {
    const n = Number(ms) || 0
    if (Math.abs(n) < 0.05) return '0 ms'
    const sign = n > 0 ? '+' : '−'
    const abs = Math.abs(n)
    if (abs < 10) return `${sign}${abs.toFixed(1)} ms`
    return `${sign}${Math.round(abs)} ms`
  }

  function formatSignedPctText(pct) {
    const n = Number(pct) || 0
    if (Math.abs(n) < 0.05) return '0%'
    const sign = n > 0 ? '+' : '−'
    return `${sign}${Math.abs(n).toFixed(0)}%`
  }

  function buildCompareSummary({ totalDelta, totalDeltaPct, paramsDiff, sqlDiff, cacheDiff, viewDiff, exceptionDiff }) {
    const parts = []
    parts.push(`${formatSignedMsText(totalDelta)} (${formatSignedPctText(totalDeltaPct)})`)

    const meaningfulParams = paramsDiff.filter((p) => !p.isFramework && p.side !== 'same')
    if (meaningfulParams.length) {
      const names = meaningfulParams.slice(0, 4).map((p) => p.name)
      const more = meaningfulParams.length > 4 ? ` +${meaningfulParams.length - 4}` : ''
      parts.push(`params: ${names.join(', ')}${more}`)
    }

    const sqlAdded = sqlDiff.filter((r) => r.side === 'onlyB').length
    const sqlRemoved = sqlDiff.filter((r) => r.side === 'onlyA').length
    const n1Gone = sqlDiff.filter((r) => r.isNPlusOneA && !r.isNPlusOneB).length
    const n1New = sqlDiff.filter((r) => !r.isNPlusOneA && r.isNPlusOneB).length
    const sqlBits = []
    if (sqlAdded) sqlBits.push(`${sqlAdded} added`)
    if (sqlRemoved) sqlBits.push(`${sqlRemoved} removed`)
    if (n1Gone) sqlBits.push(`${n1Gone} N+1 gone`)
    if (n1New) sqlBits.push(`${n1New} N+1 new`)
    if (sqlBits.length) parts.push(`SQL: ${sqlBits.join(', ')}`)

    const cacheAdded = cacheDiff.filter((r) => r.side === 'onlyB').length
    const cacheRemoved = cacheDiff.filter((r) => r.side === 'onlyA').length
    const cacheHits = cacheDiff.filter((r) => r.hitChanged).length
    if (cacheAdded || cacheRemoved || cacheHits) {
      const bits = []
      if (cacheAdded) bits.push(`${cacheAdded} added`)
      if (cacheRemoved) bits.push(`${cacheRemoved} removed`)
      if (cacheHits) bits.push(`${cacheHits} hitΔ`)
      parts.push(`cache: ${bits.join(', ')}`)
    }

    const viewAdded = viewDiff.filter((r) => r.side === 'onlyB').length
    const viewRemoved = viewDiff.filter((r) => r.side === 'onlyA').length
    if (viewAdded || viewRemoved) {
      const bits = []
      if (viewAdded) bits.push(`${viewAdded} added`)
      if (viewRemoved) bits.push(`${viewRemoved} removed`)
      parts.push(`views: ${bits.join(', ')}`)
    }

    const exChanged = exceptionDiff.filter((r) => r.side !== 'both' || r.deltaCount !== 0).length
    if (exChanged) parts.push(`errors: ${exChanged} changed`)

    return {
      text: parts.join(' · '),
      parts,
      meaningfulParamNames: meaningfulParams.map((p) => p.name),
    }
  }

  function deltaNum(a, b) {
    return (Number(b) || 0) - (Number(a) || 0)
  }

  function deltaPct(a, b) {
    const base = Number(a) || 0
    if (base === 0) {
      const next = Number(b) || 0
      if (next === 0) return 0
      return next > 0 ? 100 : -100
    }
    return ((Number(b) || 0) - base) / base * 100
  }

  const compareReady = computed(() => !!(compareAId.value && compareBId.value))

  /** Requested by Compare "Open A/B" — DetailsTabView watches this. */
  const pendingDetailTab = ref(null)
  const detailTabNonce = ref(0)

  function openCompareSide(side, tab = 'params', highlightKeys = []) {
    const id = side === 'B' ? compareBId.value : compareAId.value
    if (!id) return false
    const action = actions.value.get(normalizeRequestId(id))
    if (!action) return false
    selectedRequest.value = action
    setDetailHighlight(highlightKeys)
    pendingDetailTab.value = tab
    detailTabNonce.value += 1
    return true
  }

  function resolveCompareSide(row, preferredSide = 'B') {
    if (row?.side === 'onlyA') return 'A'
    if (row?.side === 'onlyB') return 'B'
    return preferredSide === 'A' ? 'A' : 'B'
  }

  function highlightKeysForCompareRow(requestId, kind, row) {
    const id = normalizeRequestId(requestId)
    if (!id || !row) return []

    if (kind === 'sql') {
      const patterns = new Set(
        [row.pattern, row.patternA, row.patternB, row.nearMatchPartnerPattern]
          .filter(Boolean)
          .map((p) => String(p))
      )
      return (activeRecordQueries.value.get(id) || [])
        .filter((q) => !isMetaSqlType(q.type) && patterns.has(normalizeSql(q.query)))
        .map((q) => q.sourceKey)
        .filter(Boolean)
    }

    if (kind === 'cache') {
      const key = row.key
      return (cacheCalls.value.get(id) || [])
        .filter((c) => {
          const k = c.key != null && String(c.key) !== '' ? String(c.key) : '(no key)'
          return k === key
        })
        .map((c) => c.sourceKey)
        .filter(Boolean)
    }

    if (kind === 'view') {
      const path = row.path
      return (actionViewRenders.value.get(id) || [])
        .filter((v) => {
          const p = v.view != null && String(v.view) !== '' ? String(v.view) : '(unknown)'
          return p === path
        })
        .map((v) => v.sourceKey)
        .filter(Boolean)
    }

    if (kind === 'exception') {
      const label = row.label
      return (exceptionStacktraces.value.get(id) || [])
        .filter((t) => {
          let raw = ''
          try {
            if (Array.isArray(t?.trace)) raw = t.trace.map((line) => String(line ?? '')).join('\n')
            else if (t?.trace != null) raw = String(t.trace)
          } catch {
            raw = ''
          }
          const firstLine = raw.split('\n').map((l) => l.trim()).find(Boolean) || ''
          return firstLine === label || (label && raw.includes(label))
        })
        .map((t) => t.sourceKey)
        .filter(Boolean)
    }

    return []
  }

  const COMPARE_KIND_TAB = {
    sql: 'database',
    cache: 'cache',
    view: 'rendering',
    exception: 'error',
    params: 'params',
  }

  /**
   * From a Compare diff row: select A or B, open the matching detail tab,
   * and highlight the underlying events (same as Timeline navigate).
   */
  function openCompareDiffRow(kind, row, preferredSide = 'B') {
    if (!row) return false
    const tab = COMPARE_KIND_TAB[kind] || 'timeline'
    let side = resolveCompareSide(row, preferredSide)
    let id = side === 'B' ? compareBId.value : compareAId.value
    let keys = highlightKeysForCompareRow(id, kind, row)

    // both / near: if preferred has no matches, try the other
    if (!keys.length && (row.side === 'both' || row.side === 'near' || row.nearMatch)) {
      const other = side === 'B' ? 'A' : 'B'
      const otherId = other === 'B' ? compareBId.value : compareAId.value
      const otherKeys = highlightKeysForCompareRow(otherId, kind, row)
      if (otherKeys.length) {
        side = other
        id = otherId
        keys = otherKeys
      }
    }

    return openCompareSide(side, tab, keys)
  }

  const compareResult = computed(() => {
    try {
      return buildCompareResult()
    } catch (err) {
      console.warn('rails_panel: compareResult failed', err)
      return null
    }
  })

  function buildCompareResult() {
    if (!compareAId.value || !compareBId.value) return null
    const a = summarizeForCompare(compareAId.value)
    const b = summarizeForCompare(compareBId.value)
    if (!a || !b) return null

    const cacheA = cacheGroupsFor(a.id)
    const cacheB = cacheGroupsFor(b.id)
    const cacheCountA = Array.from(cacheA.values()).reduce((acc, g) => acc + g.count, 0)
    const cacheCountB = Array.from(cacheB.values()).reduce((acc, g) => acc + g.count, 0)

    const exA = exceptionGroupsFor(a.id)
    const exB = exceptionGroupsFor(b.id)
    const exCountA = Array.from(exA.values()).reduce((acc, g) => acc + g.count, 0)
    const exCountB = Array.from(exB.values()).reduce((acc, g) => acc + g.count, 0)

    const scaleMs = Math.max(a.duration, b.duration, 0.001)
    const metrics = [
      { key: 'total', label: 'Total', a: a.duration, b: b.duration },
      { key: 'db', label: 'DB', a: a.dbRuntime, b: b.dbRuntime },
      { key: 'view', label: 'View', a: a.viewRuntime, b: b.viewRuntime },
      { key: 'cache', label: 'Cache', a: a.cacheRuntime, b: b.cacheRuntime },
      { key: 'other', label: 'Other', a: a.otherRuntime, b: b.otherRuntime },
      { key: 'queries', label: '# queries', a: a.queryCount, b: b.queryCount, unit: 'count' },
      { key: 'n1', label: '# N+1 patterns', a: a.nPlusOnePatterns, b: b.nPlusOnePatterns, unit: 'count' },
      { key: 'views', label: '# views', a: a.viewCount, b: b.viewCount, unit: 'count' },
      { key: 'cacheCalls', label: '# cache calls', a: cacheCountA, b: cacheCountB, unit: 'count' },
      { key: 'errors', label: '# exceptions', a: exCountA, b: exCountB, unit: 'count' },
    ].map((row) => ({
      ...row,
      delta: deltaNum(row.a, row.b),
      deltaPct: row.unit === 'count' ? null : deltaPct(row.a, row.b),
    }))

    const paramsDiff = buildParamsDiff(a.id, b.id)
    const meaningfulParamDiff = paramsDiff.some((p) => !p.isFramework && p.side !== 'same')
    const meaningfulParams = paramsDiff
      .filter((p) => !p.isFramework && p.side !== 'same')
      .slice(0, 6)
      .map((p) => ({
        name: p.name,
        side: p.side,
        valueA: p.valueA,
        valueB: p.valueB,
        rawA: p.rawA,
        rawB: p.rawB,
      }))

    const groupsA = sqlPatternGroupsFor(a.id)
    const groupsB = sqlPatternGroupsFor(b.id)
    const patterns = new Set([...groupsA.keys(), ...groupsB.keys()])
    const sqlDiff = []
    for (const pattern of patterns) {
      const ga = groupsA.get(pattern)
      const gb = groupsB.get(pattern)
      const countA = ga?.count || 0
      const countB = gb?.count || 0
      const timeA = ga?.totalMs || 0
      const timeB = gb?.totalMs || 0
      let side = 'both'
      if (ga && !gb) side = 'onlyA'
      else if (!ga && gb) side = 'onlyB'
      const deltaCount = countB - countA
      const type = gb?.type || ga?.type || ''
      const sample = gb?.sample || ga?.sample || pattern
      const selectLike = isSelectLikeSql({ type, pattern, sample })
      const likelyFilterDriven = selectLike && meaningfulParamDiff && (
        side === 'onlyA' ||
        side === 'onlyB' ||
        deltaCount !== 0
      )
      sqlDiff.push({
        pattern,
        sample,
        bindsA: ga?.binds,
        bindsB: gb?.binds,
        type,
        side,
        countA,
        countB,
        timeA,
        timeB,
        deltaTime: timeB - timeA,
        deltaCount,
        isNPlusOneA: !!ga?.isNPlusOne,
        isNPlusOneB: !!gb?.isNPlusOne,
        isNPlusOne: !!(ga?.isNPlusOne || gb?.isNPlusOne),
        likelyFilterDriven,
        relatedParams: likelyFilterDriven ? meaningfulParams : [],
        nearMatch: false,
        nearMatchPartnerPattern: null,
        sqlClauseDiff: null,
      })
    }
    annotateSqlNearMatches(sqlDiff, { meaningfulParams })
    const sqlDiffCollapsed = collapseSqlNearMatches(sqlDiff)
    sqlDiffCollapsed.sort((x, y) => Math.abs(y.deltaTime) - Math.abs(x.deltaTime) || Math.abs(y.deltaCount) - Math.abs(x.deltaCount))

    const cacheDiff = mergeTimedGroups(cacheA, cacheB, 'key')
    const viewDiff = mergeTimedGroups(viewGroupsFor(a.id), viewGroupsFor(b.id), 'path')
    const exceptionDiff = mergeCountGroups(exA, exB, 'label', 'label')

    const totalDelta = deltaNum(a.duration, b.duration)
    const totalDeltaPct = deltaPct(a.duration, b.duration)
    const summary = buildCompareSummary({
      totalDelta,
      totalDeltaPct,
      paramsDiff,
      sqlDiff: sqlDiffCollapsed,
      cacheDiff,
      viewDiff,
      exceptionDiff,
    })

    const waterfallA = waterfallSpansFor(a.id, scaleMs).map((s) => ({
      ...s,
      barClass: barClassForCategory(s.category),
    }))
    const waterfallB = waterfallSpansFor(b.id, scaleMs).map((s) => ({
      ...s,
      barClass: barClassForCategory(s.category),
    }))

    return {
      a,
      b,
      sameAction: a.action === b.action,
      scaleMs,
      totalDelta,
      totalDeltaPct,
      summary,
      metrics,
      paramsDiff,
      sqlDiff: sqlDiffCollapsed,
      cacheDiff,
      viewDiff,
      exceptionDiff,
      waterfallA,
      waterfallB,
      segmentsA: [
        { key: 'view', label: 'View', ms: a.viewRuntime, barClass: 'bg-amber-500/90 dark:bg-amber-400/90' },
        { key: 'db', label: 'DB', ms: a.dbRuntime, barClass: 'bg-sky-500/90 dark:bg-sky-400/90' },
        { key: 'cache', label: 'Cache', ms: a.cacheRuntime, barClass: 'bg-emerald-500/90 dark:bg-emerald-400/90' },
        { key: 'other', label: 'Other', ms: a.otherRuntime, barClass: 'bg-surface-400/80 dark:bg-surface-500/80' },
      ],
      segmentsB: [
        { key: 'view', label: 'View', ms: b.viewRuntime, barClass: 'bg-amber-500/90 dark:bg-amber-400/90' },
        { key: 'db', label: 'DB', ms: b.dbRuntime, barClass: 'bg-sky-500/90 dark:bg-sky-400/90' },
        { key: 'cache', label: 'Cache', ms: b.cacheRuntime, barClass: 'bg-emerald-500/90 dark:bg-emerald-400/90' },
        { key: 'other', label: 'Other', ms: b.otherRuntime, barClass: 'bg-surface-400/80 dark:bg-surface-500/80' },
      ],
    }
  }

  function exportCompareJson() {
    const r = compareResult.value
    if (!r) return null
    return {
      format: 'rails-panel-compare',
      version: 1,
      exportedAt: new Date().toISOString(),
      delta: { ms: r.totalDelta, pct: r.totalDeltaPct },
      summary: r.summary.text,
      sameAction: r.sameAction,
      a: {
        id: r.a.id,
        action: r.a.action,
        status: r.a.status,
        duration: r.a.duration,
        isExternal: r.a.isExternal,
      },
      b: {
        id: r.b.id,
        action: r.b.action,
        status: r.b.status,
        duration: r.b.duration,
        isExternal: r.b.isExternal,
      },
      metrics: r.metrics,
      params: r.paramsDiff.filter((p) => p.side !== 'same'),
      sql: r.sqlDiff.map((row) => ({
        side: row.side,
        pattern: row.pattern,
        countA: row.countA,
        countB: row.countB,
        timeA: row.timeA,
        timeB: row.timeB,
        isNPlusOne: row.isNPlusOne,
        likelyFilterDriven: row.likelyFilterDriven,
      })),
      cache: r.cacheDiff,
      views: r.viewDiff,
      exceptions: r.exceptionDiff,
    }
  }

  function exportCompareText() {
    const r = compareResult.value
    if (!r) return null
    const lines = []
    lines.push('Rails Panel Compare (B − A)')
    lines.push(`Summary: ${r.summary.text}`)
    if (!r.sameAction) {
      lines.push(`WARNING: different actions (${r.a.action} vs ${r.b.action})`)
    }
    lines.push('')
    lines.push(`A: ${r.a.action} · ${r.a.status} · ${Math.round(r.a.duration)} ms${r.a.isExternal ? ' · ext' : ''}`)
    lines.push(`B: ${r.b.action} · ${r.b.status} · ${Math.round(r.b.duration)} ms${r.b.isExternal ? ' · ext' : ''}`)
    lines.push(`Delta: ${formatSignedMsText(r.totalDelta)} (${formatSignedPctText(r.totalDeltaPct)})`)
    lines.push('')

    const params = r.paramsDiff.filter((p) => !p.isFramework && p.side !== 'same')
    if (params.length) {
      lines.push('Params:')
      for (const p of params) {
        lines.push(`  [${p.side}] ${p.name}: ${p.valueA} → ${p.valueB}`)
      }
      lines.push('')
    }

    const sqlChanged = r.sqlDiff.filter(
      (row) => row.side !== 'both' || row.deltaCount !== 0 || row.isNPlusOneA !== row.isNPlusOneB
    )
    if (sqlChanged.length) {
      lines.push('SQL patterns:')
      for (const row of sqlChanged.slice(0, 40)) {
        const related = (row.relatedParams || [])
          .map((p) => (typeof p === 'string' ? p : p.name))
          .filter(Boolean)
          .join(', ')
        const flag = row.likelyFilterDriven
          ? ` [filter-driven?${related ? `: ${related}` : ''}]`
          : ''
        const n1 = row.isNPlusOne ? ' [N+1]' : ''
        lines.push(`  [${row.side}] ${row.countA}→${row.countB} · ${Math.round(row.timeA)}→${Math.round(row.timeB)} ms${n1}${flag}`)
        lines.push(`    ${row.pattern.slice(0, 160)}`)
      }
      lines.push('')
    }

    const cacheChanged = r.cacheDiff.filter(
      (row) => row.side !== 'both' || row.deltaCount !== 0 || row.hitChanged
    )
    if (cacheChanged.length) {
      lines.push('Cache keys:')
      for (const row of cacheChanged.slice(0, 30)) {
        const hit = row.hitChanged
          ? ` · hit ${row.hitsA}/${row.missesA}→${row.hitsB}/${row.missesB}`
          : ''
        lines.push(`  [${row.side}] ${row.key} · ${row.countA}→${row.countB}${hit}`)
      }
      lines.push('')
    }

    const viewChanged = r.viewDiff.filter((row) => row.side !== 'both' || row.deltaCount !== 0)
    if (viewChanged.length) {
      lines.push('Views:')
      for (const row of viewChanged.slice(0, 30)) {
        lines.push(`  [${row.side}] ${row.path} · ${row.countA}→${row.countB}`)
      }
      lines.push('')
    }

    const exChanged = r.exceptionDiff.filter((row) => row.side !== 'both' || row.deltaCount !== 0)
    if (exChanged.length) {
      lines.push('Exceptions:')
      for (const row of exChanged.slice(0, 20)) {
        lines.push(`  [${row.side}] ${row.countA}→${row.countB} · ${String(row.label).slice(0, 120)}`)
      }
    }

    return lines.join('\n').trim() + '\n'
  }

  /**
   * Export selected (or given) request as portable JSON for another machine.
   */
  function exportRequestJson(requestId = selectedRequest.value?.id) {
    if (requestId == null) return null
    const id = normalizeRequestId(requestId)
    const action = actions.value.get(id)
    if (!action) return null
    const events = rawEventsByRequest.value.get(id)
    if (!events?.length) {
      throw new Error('No raw events available to export for this request')
    }
    return {
      format: 'rails-panel-request',
      version: 1,
      exportedAt: new Date().toISOString(),
      request_id: id,
      action: {
        name: action.action,
        status: action.status,
        method: action.method,
        format: action.format,
        duration: action.duration,
      },
      events: JSON.parse(JSON.stringify(events)),
    }
  }

  /**
   * Import a rails-panel (or raw meta_request events) JSON and mark it external.
   */
  function importRequestJson(payload) {
    let data = payload
    if (typeof data === 'string') data = JSON.parse(data)

    let events = null
    let originalId = null

    if (Array.isArray(data)) {
      events = data
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.events)) {
        events = data.events
        originalId = data.request_id || data.requestId || null
      } else if (Array.isArray(data.data)) {
        events = data.data
      }
    }

    if (!events?.length) {
      throw new Error('JSON must include an events array (rails-panel export or meta_request dump)')
    }

    const stamp = Date.now().toString(36)
    const rand = Math.random().toString(36).slice(2, 8)
    const newId = `external:${stamp}:${rand}`
    const action = pushEvents(newId, events, true, { isExternal: true })
    if (!action) throw new Error('Could not import: missing process_action.action_controller event')
    if (originalId) action.importedFrom = String(originalId)
    return action
  }

  return { 
    requests,
    requestCount,
    selectedRequest,
    selectedActiveRecordQueries, 
    selectedParams,
    selectedActionViewRenders,
    selectedLogEntries,
    selectedExceptionStacktraces,
    selectedCacheCalls,
    selectedTimeline,
    detailHighlightKeys,
    setDetailHighlight,
    clearDetailHighlight,
    isDetailHighlighted,
    pushEvents,
    clear,
    clearOlder,
    pruneToCap,
    exportRequestJson,
    importRequestJson,
    compareAId,
    compareBId,
    compareOpenNonce,
    compareReady,
    compareResult,
    compareSlotFor,
    setCompareSlot,
    clearCompare,
    swapCompare,
    openCompareSide,
    openCompareDiffRow,
    pendingDetailTab,
    detailTabNonce,
    exportCompareJson,
    exportCompareText,
  }
})

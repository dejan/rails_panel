<template>
  <div v-if="exception" class="h-full min-h-0 flex flex-col">
    <DetailSearch
      v-if="allFrames.length > 0"
      v-model="query"
      placeholder="Filter stack…"
      :count="isFiltering ? matchCount : null"
    />
    <div class="flex-1 min-h-0 overflow-auto p-3 space-y-2">
      <div
        class="flex items-center gap-2 min-w-0 rounded-sm px-2.5 py-1.5
               bg-red-600 dark:bg-red-500 text-white"
      >
        <span class="inline-block size-1.5 rounded-full bg-white shrink-0" aria-hidden="true"></span>
        <span class="shrink-0 text-xs font-medium leading-none">{{ exception.label }}</span>
        <span
          v-if="exception.detail && exception.detail !== exception.label"
          class="min-w-0 truncate text-[11px] leading-none text-white"
          :title="exception.detail"
        >
          {{ exception.detail }}
        </span>
      </div>

      <div
        v-if="filteredRows.length"
        class="rounded-sm bg-red-600/10 dark:bg-red-500/10 px-2 py-1 space-y-0.5"
      >
        <div
          v-for="frame in filteredRows"
          :key="frame.sourceKey"
          class="rp-error-frame flex items-center gap-2 min-w-0 rounded-sm px-1.5 py-1
                 font-mono text-[12px] leading-none
                 text-red-800 dark:text-red-200"
          :class="rowClass(frame)"
        >
          <span class="shrink-0 text-red-500 dark:text-red-400" aria-hidden="true">↳</span>
          <div v-if="frame.filepath" class="shrink-0 whitespace-nowrap text-[12px] leading-none">
            <FilepathLink :filepath="frame.filepath" :line="frame.line" />
          </div>
          <span
            v-if="frame.detail"
            class="min-w-0 truncate text-[12px] leading-none"
            :title="frame.trace"
          >
            {{ frame.detail }}
          </span>
        </div>
      </div>
      <div
        v-else-if="isFiltering"
        class="text-sm text-surface-600 dark:text-surface-300 px-1"
      >
        No stack frames match this filter.
      </div>
    </div>
  </div>
  <div v-else class="p-2 text-sm text-surface-600 dark:text-surface-300">
    There were no unhandleded errors during processing of this request.
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEventsStore } from '../stores/events'
import FilepathLink from './FilepathLink.vue'
import DetailSearch from './DetailSearch.vue'
import { parseStackLocation } from './utils/stacktrace'
import { useRowHighlight } from './utils/useRowHighlight'
import { includesText, useDetailSearch } from './utils/useDetailSearch'

const store = useEventsStore()

const exception = computed(() => {
  const span = (store.selectedTimeline?.spans || []).find((s) => s.category === 'error')
  if (span) {
    return {
      label: span.label || 'Exception',
      detail: span.detail || '',
    }
  }

  const entries = store.selectedExceptionStacktraces || []
  if (!entries.length) return null

  const first = String(entries[0]?.trace || '')
  const match = first.match(/^([A-Za-z0-9_.:]+)\s*\((.*)\)\s*$/)
  if (match) {
    return { label: match[1], detail: match[2] }
  }
  return { label: first.split(':')[0] || 'Exception', detail: first }
})

const allFrames = computed(() => {
  const label = exception.value?.label
  const entries = store.selectedExceptionStacktraces || []
  return entries
    .map((entry, index) => {
      const loc = parseStackLocation(entry.trace)
      return {
        _key: index,
        trace: entry.trace,
        detail: frameDetail(entry.trace, loc),
        filepath: loc.filepath,
        line: loc.line,
        sourceKey: entry.sourceKey || `error:${index}`,
      }
    })
    .filter((row, index) => {
      if (index === 0 && label && String(row.trace).includes(label)) return false
      return true
    })
})

const { query, filteredRows, isFiltering, matchCount } = useDetailSearch(
  () => allFrames.value,
  (row, q) =>
    includesText(row.filepath, q) ||
    includesText(row.detail, q) ||
    includesText(row.trace, q)
)

/** Remaining text after the linked location (e.g. `:in 'thumbnail'`). */
function frameDetail(trace, loc) {
  const text = String(trace || '')
  if (!loc?.filepath) return text
  const prefix = loc.line != null ? `${loc.filepath}:${loc.line}` : loc.filepath
  const idx = text.indexOf(prefix)
  if (idx < 0) return text
  return text.slice(idx + prefix.length).trim() || ''
}

const { rowClass } = useRowHighlight(() => filteredRows.value)
</script>

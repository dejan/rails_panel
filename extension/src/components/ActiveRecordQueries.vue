<template>
<div class="h-full min-h-0 w-full flex flex-col">
  <DetailSearch
    v-if="allRows.length > 0"
    v-model="query"
    placeholder="Filter queries…"
    :count="isFiltering ? matchCount : null"
  />
  <div
    v-if="nPlusOneSummary.length > 0"
    class="shrink-0 flex flex-wrap items-center gap-x-3 gap-y-1 px-2 py-1.5 text-[11px]
           bg-amber-500/10 dark:bg-amber-400/10
           border-b border-amber-500/25 dark:border-amber-400/20
           text-amber-900 dark:text-amber-200"
  >
    <span class="font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
      Possible N+1
    </span>
    <span>
      {{ nPlusOneSummary.length }} pattern{{ nPlusOneSummary.length === 1 ? '' : 's' }}
      · {{ nPlusOneQueryCount }} quer{{ nPlusOneQueryCount === 1 ? 'y' : 'ies' }}
      · {{ formatMs(nPlusOneTotalMs) }}
    </span>
    <button
      type="button"
      class="rounded px-1.5 py-0.5 font-medium cursor-pointer
             bg-amber-500/15 hover:bg-amber-500/25
             ring-1 ring-amber-500/30"
      :title="showOnlyNPlusOne ? 'Show all queries' : 'Show only N+1 patterns'"
      @click="showOnlyNPlusOne = !showOnlyNPlusOne"
    >
      {{ showOnlyNPlusOne ? 'Show all' : 'Show N+1' }}
    </button>
  </div>
  <div class="flex-1 min-h-0 min-w-0">
    <DetailsTable
      v-if="allRows.length > 0 && filteredRows.length > 0"
      :value="filteredRows"
      dataKey="_key"
      rowHover
      state-key="rp-database-columns-v8"
      class="cursor-pointer"
      :row-class="rowClass"
      @row-click="onRowClick"
    >
      <Column field="location" header="Location" :style="colFitMax('16rem')">
        <template #body="slotProps">
          <div class="min-w-0 truncate" @click.stop>
            <FilepathLink
              :filepath="slotProps.data.location"
              :line="slotProps.data.line"
            />
          </div>
        </template>
      </Column>

      <Column field="type" header="Type" :style="colFit">
        <template #body="slotProps">
          <span class="inline-flex items-center gap-1 min-w-0 max-w-full">
            <span class="block truncate">{{ slotProps.data.type }}</span>
            <span
              v-if="slotProps.data.isNPlusOne"
              class="shrink-0 rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide
                     bg-amber-500/20 text-amber-800 dark:text-amber-300
                     ring-1 ring-amber-500/30"
              :title="`Repeated ${slotProps.data.repeatCount}× (possible N+1)`"
            >N+1 ×{{ slotProps.data.repeatCount }}</span>
            <span
              v-else-if="slotProps.data.isRepeated"
              class="shrink-0 rounded px-1 py-px text-[9px] font-semibold tabular-nums
                     bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300"
              :title="`Repeated ${slotProps.data.repeatCount}×`"
            >×{{ slotProps.data.repeatCount }}</span>
          </span>
        </template>
      </Column>

      <Column field="query" header="Query" :style="colFillQuery">
        <template #body="slotProps">
          <pre
            class="hljs font-mono text-[11px] leading-tight m-0 truncate"
            :title="slotProps.data.query"
            v-html="highlightSql(slotProps.data.query)"
          ></pre>
        </template>
      </Column>

      <Column field="binds" header="Binds" :style="colFillBinds">
        <template #body="slotProps">
          <span
            v-if="hasBinds(slotProps.data)"
            class="block truncate font-mono text-[11px] text-surface-700 dark:text-surface-200"
            :title="formatBindsCompact(slotProps.data.binds)"
          >
            {{ formatBindsCompact(slotProps.data.binds) }}
          </span>
          <span v-else class="text-surface-400 dark:text-surface-500">—</span>
        </template>
      </Column>

      <Column
        field="duration"
        header="Time"
        sortable
        :style="colFit"
        :pt="timeCol"
      >
        <template #body="slotProps">
          <span class="block truncate" :class="durationClass(slotProps.data.duration)">
            {{ formatMs(slotProps.data.duration) }}
          </span>
        </template>
      </Column>

      <ColumnGroup type="footer">
        <Row>
          <Column
            :footer="'Total time: ' + formatMs(totalMs)"
            :colspan="5"
            footerStyle="text-align:right"
          />
        </Row>
      </ColumnGroup>
    </DetailsTable>

    <div
      v-else-if="allRows.length > 0"
      class="p-2 text-sm text-surface-600 dark:text-surface-300"
    >
      No queries match this filter.
    </div>
    <div v-else class="p-2 text-sm text-surface-600 dark:text-surface-300">
      There were no database queries while processing this request.
    </div>
  </div>

  <Dialog
    v-model:visible="detailVisible"
    modal
    :style="{ width: 'min(52rem, 96vw)' }"
    :breakpoints="{ '640px': '98vw' }"
    :pt="dialogPt"
  >
    <template #header>
      <div v-if="selectedQuery" class="flex-1 min-w-0 flex flex-wrap items-start gap-x-3 gap-y-2 pr-2">
        <div class="min-w-0">
          <div class="text-[10px] font-semibold uppercase tracking-[0.08em] text-sky-700 dark:text-sky-400 mb-0.5">
            Database query
          </div>
          <div class="text-lg font-semibold leading-tight text-surface-900 dark:text-surface-50 truncate">
            {{ selectedQuery.type || 'SQL' }}
          </div>
        </div>
        <span
          class="shrink-0 mt-0.5 inline-flex items-center rounded-md px-2 py-1 text-sm font-semibold tabular-nums
                 ring-1 ring-inset"
          :class="durationBadgeClass(selectedQuery.duration)"
        >
          {{ formatMs(selectedQuery.duration) }}
        </span>
      </div>
      <span v-else class="flex-1">Query</span>
    </template>

    <div v-if="selectedQuery" class="space-y-3 max-h-[72vh] overflow-auto">
      <div
        v-if="selectedQuery.location"
        class="flex items-baseline gap-2 text-[12px] min-w-0 px-0.5"
      >
        <span class="shrink-0 text-[10px] font-semibold uppercase tracking-[0.08em] text-surface-400 dark:text-surface-500">
          Location
        </span>
        <FilepathLink
          :filepath="selectedQuery.location"
          :line="selectedQuery.line"
          :truncate="false"
        />
      </div>

      <section
        class="min-w-0 rounded-md border border-surface-200 dark:border-surface-600 overflow-hidden
               border-l-[3px] border-l-sky-500 dark:border-l-sky-400"
      >
        <div class="flex items-center justify-between gap-2 px-3 py-2
                    border-b border-surface-200 dark:border-surface-600
                    bg-surface-100/60 dark:bg-surface-800/60">
          <h3 class="text-[11px] font-semibold uppercase tracking-[0.1em] text-sky-700 dark:text-sky-400 m-0">
            SQL
          </h3>
          <CopyButton
            label="Copy SQL"
            title="Copy SQL to clipboard"
            :get-text="() => selectedQuery?.query || ''"
          />
        </div>
        <pre
          class="hljs font-mono text-[13px] leading-[1.55] whitespace-pre-wrap break-normal m-0 px-3.5 py-3
                 bg-surface-50 dark:bg-surface-900 overflow-x-auto"
          v-html="highlightSql(selectedQuery.query)"
        ></pre>
      </section>

      <section
        class="min-w-0 rounded-md border border-surface-200 dark:border-surface-600 overflow-hidden
               border-l-[3px] border-l-surface-400 dark:border-l-surface-500"
      >
        <div class="flex items-center justify-between gap-2 px-3 py-2
                    border-b border-surface-200 dark:border-surface-600
                    bg-surface-100/60 dark:bg-surface-800/60">
          <h3 class="text-[11px] font-semibold uppercase tracking-[0.1em] text-surface-500 dark:text-surface-400 m-0">
            Binds
            <span
              v-if="hasBinds(selectedQuery)"
              class="ml-1 font-normal normal-case tracking-normal tabular-nums text-surface-400"
            >
              {{ bindsCount(selectedQuery) }}
            </span>
          </h3>
          <CopyButton
            v-if="hasBinds(selectedQuery)"
            label="Copy binds"
            title="Copy binds to clipboard"
            :get-text="() => formatBindsPlain(selectedQuery.binds)"
          />
        </div>
        <pre
          v-if="hasBinds(selectedQuery)"
          class="font-mono text-[12px] leading-[1.5] whitespace-pre-wrap break-words m-0 px-3.5 py-3
                 bg-surface-50 dark:bg-surface-900
                 text-surface-800 dark:text-surface-100"
          v-html="formatBindsHtml(selectedQuery.binds)"
        ></pre>
        <p
          v-else
          class="m-0 text-[12px] text-surface-400 dark:text-surface-500 italic px-3.5 py-3"
        >
          No bind parameters
        </p>
      </section>
    </div>
  </Dialog>
</div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useEventsStore } from '../stores/events';
import DetailsTable from './wrappers/DetailsTable.vue'
import ColumnGroup from 'primevue/columngroup'
import Column from 'primevue/column'
import Row from 'primevue/row'
import Dialog from 'primevue/dialog'
import hljs from 'highlight.js/lib/core'
import sql from 'highlight.js/lib/languages/sql'
import { prettyPrintJson } from 'pretty-print-json'
import FilepathLink from './FilepathLink.vue'
import DetailSearch from './DetailSearch.vue'
import { colFit, colFitMax, colFillQuery, colFillBinds } from './utils/columns'
import { useRowHighlight } from './utils/useRowHighlight'
import { includesText, useDetailSearch } from './utils/useDetailSearch'
import { annotateQueryRepeats, nPlusOneGroups } from './utils/sqlPatterns'
import { useSettingsStore } from '../stores/settings'
import CopyButton from './CopyButton.vue'

hljs.registerLanguage('sql', sql);

const store = useEventsStore()
const settings = useSettingsStore()
const detailVisible = ref(false)
const selectedQuery = ref(null)
const showOnlyNPlusOne = ref(false)

const bindsPrettyOptions = {
  indent: 2,
  quoteKeys: true,
  quoteStyle: 'double',
  trailingCommas: false,
  linkUrls: false,
}

const timeCol = {
  headerCell: { class: '!text-center', style: { paddingRight: '1rem' } },
  headerContent: { class: 'flex justify-center' },
  bodyCell: { class: '!text-center', style: { paddingRight: '1rem' } },
}

const dialogPt = {
  root: {
    class: [
      'rounded-lg shadow-xl',
      'border border-surface-200 dark:border-surface-600',
      '!max-w-[52rem] max-h-[90vh] m-0',
      'bg-surface-0 dark:bg-surface-800',
    ].join(' '),
  },
  header: {
    class: [
      'flex items-start justify-between gap-3 shrink-0',
      'px-5 pt-4 pb-3',
      'rounded-tl-lg rounded-tr-lg',
      'bg-surface-0 dark:bg-surface-800',
      'border-b border-surface-200 dark:border-surface-700',
      'text-surface-700 dark:text-surface-0/80',
    ].join(' '),
  },
  icons: {
    class: 'flex items-center shrink-0',
  },
  closeButton: {
    class: [
      'relative flex items-center justify-center',
      'w-7 h-7 border-0 rounded-full',
      'text-surface-500 bg-transparent',
      'transition duration-200 ease-in-out',
      'hover:text-surface-700 dark:hover:text-white/80',
      'hover:bg-surface-100 dark:hover:bg-surface-700',
      'focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400',
    ].join(' '),
  },
  content: {
    class: [
      'text-sm px-5 pt-4 pb-5',
      'rounded-bl-lg rounded-br-lg',
      'bg-surface-0 dark:bg-surface-800',
      'text-surface-600 dark:text-surface-0/70',
      'overflow-y-auto',
    ].join(' '),
  },
}

const allRows = computed(() =>
  annotateQueryRepeats(
    (store.selectedActiveRecordQueries || []).map((q, index) => ({
      ...q,
      _key: index,
    })),
    { nPlusOneMin: settings.nPlusOneMin }
  )
)

const nPlusOneSummary = computed(() =>
  nPlusOneGroups(allRows.value, { nPlusOneMin: settings.nPlusOneMin })
)
const nPlusOneQueryCount = computed(() =>
  nPlusOneSummary.value.reduce((acc, g) => acc + g.count, 0)
)
const nPlusOneTotalMs = computed(() =>
  nPlusOneSummary.value.reduce((acc, g) => acc + g.totalMs, 0)
)

const rowsForSearch = computed(() =>
  showOnlyNPlusOne.value ? allRows.value.filter((r) => r.isNPlusOne) : allRows.value
)

const { query, filteredRows, isFiltering, matchCount } = useDetailSearch(
  () => rowsForSearch.value,
  (row, q) =>
    includesText(row.location, q) ||
    includesText(row.type, q) ||
    includesText(row.query, q) ||
    includesText(row.binds, q) ||
    (row.isNPlusOne && 'n+1'.includes(q))
)

const { rowClass: highlightRowClass } = useRowHighlight(() => filteredRows.value)

function rowClass(data) {
  const base = highlightRowClass(data) || ''
  if (data?.isNPlusOne) {
    return [base, 'bg-amber-500/5 dark:bg-amber-400/5'].filter(Boolean).join(' ')
  }
  return base
}

const totalMs = computed(() =>
  filteredRows.value.reduce((acc, q) => acc + (Number(q.duration) || 0), 0)
)

watch(
  () => store.selectedRequest?.id,
  () => {
    detailVisible.value = false
    selectedQuery.value = null
    showOnlyNPlusOne.value = false
  }
)

function onRowClick(event) {
  if (event.originalEvent?.target?.closest?.('a, button')) return
  selectedQuery.value = event.data
  detailVisible.value = true
}

function highlightSql(query) {
  try {
    return hljs.highlight(query, { language: 'sql' }).value
  } catch {
    return query
  }
}

function hasBinds(data) {
  const binds = data?.binds
  if (binds == null) return false
  if (Array.isArray(binds)) return binds.length > 0
  if (typeof binds === 'object') return Object.keys(binds).length > 0
  return String(binds).length > 0
}

function bindsCount(data) {
  const binds = data?.binds
  if (Array.isArray(binds)) return binds.length
  if (binds && typeof binds === 'object') return Object.keys(binds).length
  return 1
}

function formatBindsCompact(binds) {
  try {
    return JSON.stringify(binds).replace(/,/g, ', ')
  } catch {
    return String(binds)
  }
}

function formatBindsPlain(binds) {
  try {
    return JSON.stringify(binds, null, 2)
  } catch {
    return String(binds)
  }
}

function formatBindsHtml(binds) {
  try {
    return prettyPrintJson.toHtml(binds, bindsPrettyOptions)
  } catch {
    try {
      return escapeHtml(JSON.stringify(binds, null, 2))
    } catch {
      return escapeHtml(String(binds))
    }
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function durationClass(ms) {
  if (ms >= 100) return 'text-red-600 dark:text-red-400 font-semibold'
  if (ms >= 40) return 'text-amber-700 dark:text-amber-400'
  return 'text-surface-700 dark:text-surface-200'
}

function durationBadgeClass(ms) {
  if (ms >= 100) {
    return 'text-red-700 dark:text-red-300 bg-red-500/10 ring-red-500/30'
  }
  if (ms >= 40) {
    return 'text-amber-800 dark:text-amber-300 bg-amber-500/10 ring-amber-500/30'
  }
  return 'text-sky-800 dark:text-sky-300 bg-sky-500/10 ring-sky-500/30'
}

function formatMs(ms) {
  const n = Number(ms) || 0
  if (n <= 0) return '0 ms'
  if (n < 0.1) return '<0.1 ms'
  if (n < 10) return `${n.toFixed(1)} ms`
  return `${Math.round(n)} ms`
}
</script>

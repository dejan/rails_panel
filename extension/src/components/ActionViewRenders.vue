<template>
<div class="h-full min-h-0 w-full flex flex-col">
  <DetailSearch
    v-if="allRows.length > 0"
    v-model="query"
    placeholder="Filter templates…"
    :count="isFiltering ? matchCount : null"
  />
  <div class="flex-1 min-h-0 min-w-0">
    <DetailsTable
      v-if="allRows.length > 0 && filteredRows.length > 0"
      :value="filteredRows"
      dataKey="_key"
      state-key="rp-rendering-columns-v10"
      :row-class="rowClass"
    >
      <Column field="view" header="Template" :style="colFill">
        <template #body="slotProps">
          <div
            class="flex items-center gap-x-1.5 min-w-0 max-w-full overflow-hidden"
            :title="templateTitle(slotProps.data)"
          >
            <span
              v-if="slotProps.data.nestDepth"
              class="shrink-0 leading-none text-surface-400 dark:text-surface-500"
              :style="{ paddingLeft: `${(slotProps.data.nestDepth - 1) * 0.75}rem` }"
              aria-hidden="true"
            >↳</span>
            <span class="min-w-0 truncate leading-none">
              <FilepathLink :filepath="slotProps.data.view" />
            </span>
            <span
              v-if="slotProps.data.layout"
              class="min-w-0 truncate leading-none text-surface-500 dark:text-surface-400"
            >
              within {{ slotProps.data.layout }}
            </span>
          </div>
        </template>
      </Column>
      <Column
        sortable
        field="durationExclusive"
        header="Time"
        :style="colFit"
        :pt="timeCol"
      >
        <template #body="slotProps">
          <span
            class="block truncate"
            :class="durationClass(slotProps.data.durationExclusive)"
            :title="'Time in this template only (excludes nested renders)'"
          >
            {{ formatMs(slotProps.data.durationExclusive) }}
          </span>
        </template>
      </Column>
      <Column
        sortable
        field="durationInclusive"
        header="Total"
        :style="colFit"
        :pt="timeCol"
      >
        <template #body="slotProps">
          <span
            class="block truncate"
            :class="durationClass(slotProps.data.durationInclusive ?? slotProps.data.duration)"
            :title="'Wall-clock (includes nested renders)'"
          >
            {{ formatMs(slotProps.data.durationInclusive ?? slotProps.data.duration) }}
          </span>
        </template>
      </Column>
      <ColumnGroup type="footer">
        <Row>
          <Column :colspan="3" footerStyle="text-align:right">
            <template #footer>
              <span :title="totalTitle || undefined">{{ totalLabel }}</span>
            </template>
          </Column>
        </Row>
      </ColumnGroup>
    </DetailsTable>
    <div
      v-else-if="allRows.length > 0"
      class="p-2 text-sm text-surface-600 dark:text-surface-300"
    >
      No templates match this filter.
    </div>
    <div v-else class="p-2 text-sm text-surface-600 dark:text-surface-300">
      Nothing was rendered for this request.
    </div>
  </div>
</div>
</template>

<script setup>
import { computed } from 'vue'
import { useEventsStore } from '../stores/events';
import ColumnGroup from 'primevue/columngroup';
import Column from 'primevue/column';
import Row from 'primevue/row';
import DetailsTable from './wrappers/DetailsTable.vue';
import FilepathLink from './FilepathLink.vue'
import DetailSearch from './DetailSearch.vue'
import { colFit, colFill } from './utils/columns';
import { sumExclusive } from './utils/timing';
import { useRowHighlight } from './utils/useRowHighlight'
import { includesText, useDetailSearch } from './utils/useDetailSearch'

const store = useEventsStore()

/** Parent-first tree order: earlier start, longer wall first. */
const allRows = computed(() => {
  const list = (store.selectedActionViewRenders || []).map((row, index) => ({
    ...row,
    _key: index,
  }))
  return [...list].sort((a, b) => {
    const aStart = Number(a.time) || 0
    const bStart = Number(b.time) || 0
    if (aStart !== bStart) return aStart - bStart
    return (Number(b.durationInclusive ?? b.duration) || 0) - (Number(a.durationInclusive ?? a.duration) || 0)
  })
})

const { query, filteredRows, isFiltering, matchCount } = useDetailSearch(
  () => allRows.value,
  (row, q) => includesText(row.view, q) || includesText(row.layout, q)
)

const { rowClass } = useRowHighlight(() => filteredRows.value)

/** Sum of Self only — does not double-count nested wall times. */
const totalMs = computed(() => sumExclusive(filteredRows.value))

const railsViewMs = computed(() => {
  const n = Number(store.selectedRequest?.viewRuntime)
  return Number.isFinite(n) && n >= 0 ? n : null
})

const totalLabel = computed(() => `Total time: ${formatMs(totalMs.value)}`)

const totalTitle = computed(() => {
  if (isFiltering.value) return 'Total for filtered templates only'
  if (railsViewMs.value == null) return ''
  if (Math.abs(railsViewMs.value - totalMs.value) < 0.5) return ''
  return `Rails view_runtime: ${formatMs(railsViewMs.value)} (includes view work outside individual templates)`
})

const timeCol = {
  headerCell: { class: '!text-center', style: { paddingRight: '1rem' } },
  headerContent: { class: 'flex justify-center' },
  bodyCell: { class: '!text-center', style: { paddingRight: '1rem' } },
}

function templateTitle(data) {
  return data.layout ? `${data.view} within ${data.layout}` : data.view
}

function formatMs(ms) {
  const n = Number(ms) || 0
  if (n <= 0) return '0 ms'
  if (n < 0.1) return '<0.1 ms'
  if (n < 10) return `${n.toFixed(1)} ms`
  return `${Math.round(n)} ms`
}

function durationClass(ms) {
  if (ms >= 100) return 'text-red-600 dark:text-red-400 font-semibold'
  if (ms >= 40) return 'text-amber-700 dark:text-amber-400'
  return 'text-surface-700 dark:text-surface-200'
}
</script>

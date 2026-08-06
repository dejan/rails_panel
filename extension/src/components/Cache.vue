<template>
<div class="h-full min-h-0 w-full flex flex-col">
  <DetailSearch
    v-if="allRows.length > 0"
    v-model="query"
    placeholder="Filter cache…"
    :count="isFiltering ? matchCount : null"
  />
  <div class="flex-1 min-h-0 min-w-0">
    <DetailsTable
      v-if="allRows.length > 0 && filteredRows.length > 0"
      :value="filteredRows"
      state-key="rp-cache-columns-v7"
      :row-class="rowClass"
    >
      <Column field="location" header="Location" :style="colFitMax('16rem')">
        <template #body="slotProps">
          <div class="min-w-0 truncate">
            <FilepathLink :filepath="slotProps.data.filename" :line="slotProps.data.line" />
          </div>
        </template>
      </Column>
      <Column field="type" header="Type" :style="colFit">
        <template #body="slotProps">
          <span class="block truncate">{{ slotProps.data.type }}</span>
        </template>
      </Column>
      <Column field="key" header="Key" :style="colFill">
        <template #body="slotProps">
          <span class="block truncate font-mono text-[12px]" :title="String(slotProps.data.key)">
            {{ slotProps.data.key }}
          </span>
        </template>
      </Column>
      <Column field="hit" header="Hit" :style="colFit" :pt="centeredCol">
        <template #body="slotProps">
          <span class="block truncate">{{ slotProps.data.hit }}</span>
        </template>
      </Column>
      <Column
        sortable
        field="duration"
        header="Time"
        :style="colFit"
        :pt="timeCol"
      >
        <template #body="slotProps">
          <span class="block truncate">
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
      No cache calls match this filter.
    </div>
    <div v-else class="p-2 text-sm text-surface-600 dark:text-surface-300">
      There were no calls to cache during processing of this request.
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
import FilepathLink from './FilepathLink.vue';
import DetailSearch from './DetailSearch.vue'
import { colFit, colFitMax, colFill } from './utils/columns';
import { useRowHighlight } from './utils/useRowHighlight'
import { includesText, useDetailSearch } from './utils/useDetailSearch'

const store = useEventsStore()

const allRows = computed(() =>
  (store.selectedCacheCalls || []).map((row, index) => ({ ...row, _key: index }))
)

const { query, filteredRows, isFiltering, matchCount } = useDetailSearch(
  () => allRows.value,
  (row, q) =>
    includesText(row.filename, q) ||
    includesText(row.type, q) ||
    includesText(row.key, q) ||
    includesText(row.hit, q)
)

const { rowClass } = useRowHighlight(() => filteredRows.value)

const totalMs = computed(() =>
  filteredRows.value.reduce((acc, q) => acc + (Number(q.duration) || 0), 0)
)

const centeredCol = {
  headerCell: { class: '!text-center' },
  headerContent: { class: 'flex justify-center' },
  bodyCell: { class: '!text-center' },
}

const timeCol = {
  headerCell: { class: '!text-center', style: { paddingRight: '1rem' } },
  headerContent: { class: 'flex justify-center' },
  bodyCell: { class: '!text-center', style: { paddingRight: '1rem' } },
}

function formatMs(ms) {
  const n = Number(ms) || 0
  if (n <= 0) return '0 ms'
  if (n < 0.1) return '<0.1 ms'
  if (n < 10) return `${n.toFixed(1)} ms`
  return `${Math.round(n)} ms`
}
</script>

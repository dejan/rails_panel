<template>
<div class="h-full min-h-0 w-full flex flex-col">
  <DetailSearch
    v-if="allRows.length > 0"
    v-model="query"
    placeholder="Filter log…"
    :count="isFiltering ? matchCount : null"
  />
  <div class="flex-1 min-h-0 min-w-0">
    <DetailsTable
      v-if="allRows.length > 0 && filteredRows.length > 0"
      :value="filteredRows"
      dataKey="_key"
      state-key="rp-log-columns-v7"
    >
      <Column field="filename" header="Location" :style="colFitMax('16rem')">
        <template #body="slotProps">
          <div class="min-w-0 truncate">
            <FilepathLink :filepath="slotProps.data.filename" :line="slotProps.data.line" />
          </div>
        </template>
      </Column>
      <Column field="level" header="Level" :style="colFit" :pt="centeredCol">
        <template #body="slotProps">
          <span class="uppercase block truncate">{{ slotProps.data.level }}</span>
        </template>
      </Column>

      <Column field="message" header="Message" :style="colFill">
        <template #body="slotProps">
          <div
            class="truncate"
            :title="plainMessage(slotProps.data.message)"
            v-html="ansiToHtml(slotProps.data.message)"
          ></div>
        </template>
      </Column>
    </DetailsTable>
    <div
      v-else-if="allRows.length > 0"
      class="p-2 text-sm text-surface-600 dark:text-surface-300"
    >
      No log entries match this filter.
    </div>
    <div v-else class="p-2 text-sm text-surface-600 dark:text-surface-300">
      There were no log entries during processing of this request.
    </div>
  </div>
</div>
</template>

<script setup>
import { computed } from 'vue'
import { useEventsStore } from '../stores/events';
import Column from 'primevue/column';
import DetailsTable from './wrappers/DetailsTable.vue';
import FilepathLink from './FilepathLink.vue'
import DetailSearch from './DetailSearch.vue'
import { colFit, colFitMax, colFill } from './utils/columns'
import { includesText, useDetailSearch } from './utils/useDetailSearch'
import { ansiToHtml, stripAnsi } from './utils/ansi'

const store = useEventsStore()

function plainMessage(message) {
  return stripAnsi(message)
}

const allRows = computed(() =>
  (store.selectedLogEntries || []).map((row, index) => ({ ...row, _key: index }))
)

const { query, filteredRows, isFiltering, matchCount } = useDetailSearch(
  () => allRows.value,
  (row, q) =>
    includesText(row.filename, q) ||
    includesText(row.level, q) ||
    includesText(stripAnsi(row.message), q)
)

const centeredCol = {
  headerCell: { class: '!text-center' },
  headerContent: { class: 'flex justify-center' },
  bodyCell: { class: '!text-center' },
}
</script>

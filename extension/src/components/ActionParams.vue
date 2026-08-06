<template>
  <div class="h-full min-h-0 w-full flex flex-col">
    <div
      v-if="allRows.length > 0"
      class="shrink-0 flex items-center gap-2 px-2 py-1.5
             border-b border-surface-200 dark:border-surface-700"
    >
      <div class="relative flex-1 min-w-0">
        <i
          class="pi pi-search absolute left-2 top-1/2 -translate-y-1/2 text-[11px]
                 text-surface-400 dark:text-surface-500 pointer-events-none"
          aria-hidden="true"
        ></i>
        <input
          v-model="query"
          type="search"
          class="w-full h-7 pl-7 pr-7 rounded-md text-[12px] leading-none
                 bg-surface-0 dark:bg-surface-900
                 text-surface-800 dark:text-surface-100
                 placeholder:text-surface-400 dark:placeholder:text-surface-500
                 ring-1 ring-surface-200 dark:ring-surface-600
                 focus:outline-none focus:ring-primary-500 dark:focus:ring-primary-400"
          placeholder="Filter params…"
          autocomplete="off"
          spellcheck="false"
          @keydown.escape.prevent="query = ''"
        />
        <button
          v-if="query"
          type="button"
          class="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center
                 size-5 rounded text-surface-400 hover:text-surface-700 dark:hover:text-surface-200
                 hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer"
          title="Clear"
          @click="query = ''"
        >
          <i class="pi pi-times text-[10px]" aria-hidden="true"></i>
        </button>
      </div>
      <span
        v-if="isFiltering"
        class="shrink-0 text-[11px] tabular-nums text-surface-400 dark:text-surface-500"
      >
        {{ matchCount }}
      </span>
      <CopyButton
        label="Copy params"
        title="Copy all params as JSON"
        :get-text="copyAllParams"
      />
    </div>
    <div class="flex-1 min-h-0 min-w-0">
      <DetailsTable
        v-if="allRows.length > 0 && filteredRows.length > 0"
        :value="filteredRows"
        dataKey="_key"
        state-key="rp-params-columns-v6"
      >
        <Column field="name" header="Name" :style="colFit">
          <template #body="slotProps">
            <span class="font-bold block truncate" :title="slotProps.data.name">{{ slotProps.data.name }}</span>
          </template>
        </Column>
        <Column field="value" header="Value" :style="colFillWrap">
          <template #body="slotProps">
            <pre
              v-html="pretty(slotProps.data.value)"
              class="whitespace-pre-wrap break-words text-[12px] leading-snug m-0 max-h-40 overflow-auto"
            ></pre>
          </template>
        </Column>
      </DetailsTable>
      <div
        v-else-if="allRows.length > 0"
        class="p-2 text-sm text-surface-600 dark:text-surface-300"
      >
        No params match this filter.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEventsStore } from '../stores/events';
import Column from 'primevue/column';
import DetailsTable from './wrappers/DetailsTable.vue';
import CopyButton from './CopyButton.vue'
import { prettyPrintJson } from 'pretty-print-json';
import { colFit, colFill } from './utils/columns';
import { includesText, useDetailSearch } from './utils/useDetailSearch'

const store = useEventsStore()

const colFillWrap = {
  ...colFill,
  whiteSpace: 'normal',
  verticalAlign: 'top',
}

const allRows = computed(() =>
  (store.selectedParams || []).map((row, index) => ({ ...row, _key: index }))
)

const { query, filteredRows, isFiltering, matchCount } = useDetailSearch(
  () => allRows.value,
  (row, q) => includesText(row.name, q) || includesText(row.value, q)
)

const prettyOptions = {
  indent: 2,
  quoteKeys: true,
  quoteStyle: 'double',
  trailingCommas: false,
  linkUrls: false,
};

function copyAllParams() {
  const obj = {}
  for (const row of allRows.value) {
    obj[row.name] = row.value
  }
  try {
    return JSON.stringify(obj, null, 2)
  } catch {
    return String(obj)
  }
}

function pretty(obj) {
  try {
    return prettyPrintJson.toHtml(obj, prettyOptions);
  } catch (e) {
    console.log(e);
    return obj;
  }
}
</script>

<template>
<div class="h-full overflow-auto">
  <DetailsTable :value="store.selectedActiveRecordQueries" v-if="store.selectedActiveRecordQueries.length > 0">
    <Column field="location" header="Location">
      <template #body="slotProps">
        <FilepathLink :filepath="slotProps.data.location" :line="slotProps.data.line"/>
      </template>
    </Column>
    <Column field="type" header="Type" class="whitespace-nowrap"/>
    <Column field="query" header="Query">
      <template #body="slotProps">
        <div v-html="hljs.highlight(slotProps.data.query, { language: 'sql' }).value" class="font-mono"></div>
      </template>
    </Column>
    <Column field="binds" header="Binds"> 
      <template #body="slotProps">
        <span v-if="slotProps.data.binds.length > 0">
          {{ slotProps.data.binds  }}
        </span>
      </template>
    </Column>
    <Column field="duration" header="Time" sortable class="text-right whitespace-nowrap" :pt="{headercontent: 'flex items-center justify-end'}">
      <template #body="slotProps">
        {{ Math.ceil(slotProps.data.duration) }} ms
      </template>
    </Column>
    <ColumnGroup type="footer">
      <Row>
        <Column :footer="'Total time: ' + store.selectedActiveRecordQueries.map((q) => Math.ceil(q.duration)).reduce((a, t) => a + t) + ' ms'" :colspan="5" footerStyle="text-align:right" />
      </Row>
    </ColumnGroup> 
  </DetailsTable>
  <div v-else class="p-2 text-sm">
    There were no database queries while processing this request.
  </div>

</div>
</template>

<script setup>
import { useEventsStore } from '../stores/events';
import DetailsTable from './wrappers/DetailsTable.vue';
import ColumnGroup from 'primevue/columngroup';
import Column from 'primevue/column';
import Row from 'primevue/row';
import hljs from 'highlight.js/lib/core';
import sql from 'highlight.js/lib/languages/sql';
import FilepathLink from './FilepathLink.vue';

hljs.registerLanguage('sql', sql);

const store = useEventsStore()
</script>
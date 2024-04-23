<template>
<DetailsTable :value="store.selectedLogEntries" v-if="store.selectedLogEntries.length > 0">
  <Column field="filename" header="Location">
    <template #body="slotProps">
      <FilepathLink :filepath="slotProps.data.filename" :line="slotProps.data.line"/>
    </template>
  </Column>
  <Column field="level" header="Level">
    <template #body="slotProps">
      <span class="uppercase">{{ slotProps.data.level }}</span>
    </template>
  </Column>  

  <Column field="message" header="Message">
    <template #body="slotProps">
      <div v-html="convert.toHtml(slotProps.data.message)"></div>
    </template>
  </Column>
</DetailsTable>
  <div v-else class="p-2 text-sm">
    There were no log entries during processing of this request.
  </div>
</template>

<script setup>
import { useEventsStore } from '../stores/events';
import Column from 'primevue/column';
import DetailsTable from './wrappers/DetailsTable.vue';
import Convert from 'ansi-to-html'
import FilepathLink from './FilepathLink.vue';

var convert = new Convert();
const store = useEventsStore()
</script>
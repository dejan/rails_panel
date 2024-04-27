<template>
  <DetailsTable :value="store.selectedParams">
    <Column field="name" header="Name" class="font-bold"/>
      <Column field="value" header="Value">
        <template #body="slotProps">
          <pre v-html="pretty(slotProps.data.value)" class="whitespace-pre-wrap"></pre>
        </template>
    </Column>
  </DetailsTable>
</template>

<script setup>
import { useEventsStore } from '../stores/events';
import Column from 'primevue/column';
import DetailsTable from './wrappers/DetailsTable.vue';
import { prettyPrintJson } from 'pretty-print-json';

const store = useEventsStore()

const prettyOptions = {
  indent: 2,
  quoteKeys: true,
  quoteStyle: 'double',
  trailingCommas: false,
  linkUrls: false,
};

function pretty(obj) {
  try {
    return prettyPrintJson.toHtml(obj, prettyOptions);
  } catch (e) {
    console.log(e);
    return obj;
  }
}

</script>

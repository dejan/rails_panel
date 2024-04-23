<template>
<DetailsTable :value="store.selectedExceptionStacktraces" v-if="store.selectedExceptionStacktraces.length > 0">
  <Column field="trace" header="Stacktrace" />
</DetailsTable>
<div v-else class="p-2 text-sm">
  There were no unhandleded errors during processing of this request.
</div>
</template>

<script setup>
import { useEventsStore } from '../stores/events';
import Column from 'primevue/column';
import DetailsTable from './wrappers/DetailsTable.vue';

const store = useEventsStore()
</script>
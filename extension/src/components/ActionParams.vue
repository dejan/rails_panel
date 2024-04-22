<template>
<DetailsTable :value="store.selectedParams">
  <Column field="name" header="Name" />
  <Column field="value" header="Value" />    
</DetailsTable>
</template>

<script setup>
import { useEventsStore } from '../stores/events';
import Column from 'primevue/column';
import DetailsTable from './wrappers/DetailsTable.vue';

const store = useEventsStore()
</script>

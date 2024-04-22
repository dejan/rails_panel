<template>
<Splitted>
  <template v-slot:left>
    <SelectionTable v-model:selection="store.selectedRequest" :value="store.requests">
      <Column field="status" header="Status" class="text-center">
        <template #body="slotProps">
          <span :class="classForStatus(slotProps.data.status)">
            {{ slotProps.data.status }}
          </span>
        </template>
      </Column>
      <Column field="action" header="Action" class="font-bold "/>
      <Column field="method" header="Method" class="text-center"/>
      <Column field="format" header="Format" class="text-center"/>
      <Column field="duration" header="Time" class="text-right whitespace-nowrap">
        <template #body="slotProps">
          {{ Math.ceil(slotProps.data.duration) }} ms
        </template>
      </Column>        
    </SelectionTable>
  </template>
  <template v-slot:right>
    <DetailsTabView />
  </template>
</Splitted>
</template>

<script setup>
import Splitted from './wrappers/Splitted.vue';
import Column from 'primevue/column';
import SelectionTable from './wrappers/SelectionTable.vue';
import DetailsTabView from './DetailsTabView.vue';
import { useEventsStore } from '../stores/events';

const store = useEventsStore()

function classForStatus(status) {
  var cls = null;
  switch (true) {
    case (status >= 200) && (status < 300):
      cls = "bg-green-700/80"
      break;
    case (status >= 400) && (status < 600):
      cls = "bg-red-700/80"
      break;
    default:
      cls = "bg-purple-700/70"
  }
  return cls + " text-white p-1 rounded text-xs"
}
</script>

<template>

<DetailsTable :value="store.selectedActionViewRenders" v-if="store.selectedActionViewRenders.length > 0">
  <Column field="view" header="Template">
    <template #body="slotProps">
      <FilepathLink :filepath="slotProps.data.view" />
      <span v-if="slotProps.data.layout">
        within {{ slotProps.data.layout }}
      </span>
    </template>
  </Column>
  <Column sortable field="duration" header="Time" class="text-right whitespace-nowrap" :pt="{headercontent: 'flex items-center justify-end'}">
    <template #body="slotProps">
      {{ Math.ceil(slotProps.data.duration) }} ms
    </template>
  </Column>
  <ColumnGroup type="footer">
    <Row>
      <Column :footer="'Total time: ' + store.selectedActionViewRenders.map((q) => Math.ceil(q.duration)).reduce((a, t) => a + t) + ' ms'" :colspan="2" footerStyle="text-align:right" />
    </Row>
  </ColumnGroup>   
</DetailsTable>
<div v-else class="p-2 text-sm">
  Nothing was rendered for this request.
</div>
</template>

<script setup>
import { useEventsStore } from '../stores/events';
import ColumnGroup from 'primevue/columngroup';
import Column from 'primevue/column';
import Row from 'primevue/row';
import DetailsTable from './wrappers/DetailsTable.vue';
import FilepathLink from './FilepathLink.vue';
const store = useEventsStore()
</script>
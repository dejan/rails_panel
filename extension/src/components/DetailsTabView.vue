<template>
<Toolbar />
<Tabbed> 
  <!-- Ideally, TabPanel should also be wrapped, but there's an open bug that prevents this 
    https://github.com/primefaces/primevue/issues/3625#issuecomment-1416857660 -->

  <TabPanel header="Params" :pt="{content: 'h-full'}">
    <ActionParams v-if="store.selectedRequest" />
  </TabPanel>
  <TabPanel header="Rendering" :pt="{content: 'h-full'}">
    <ActionViewRenders v-if="store.selectedRequest" />
  </TabPanel>
  <TabPanel header="Database" :pt="{content: 'h-full'}">
    <ActiveRecordQueries v-if="store.selectedRequest" />
  </TabPanel>
  <TabPanel header="Cache" :pt="{content: 'h-full'}">
    <Cache v-if="store.selectedRequest" />
  </TabPanel>
  <TabPanel header="Log" :pt="{content: 'h-full'}">
    <LogView v-if="store.selectedRequest" />
  </TabPanel>
  <TabPanel header="Error" :pt="{content: 'h-full'}">
    <Exception v-if="store.selectedRequest"/>
  </TabPanel>
</Tabbed>
</template>

<script setup>
import TabPanel from 'primevue/tabpanel';
import Tabbed from './wrappers/Tabbed.vue'
import ActiveRecordQueries from './ActiveRecordQueries.vue';
import ActionViewRenders from './ActionViewRenders.vue';
import ActionParams from './ActionParams.vue';
import Toolbar from './Toolbar.vue';
import Cache from './Cache.vue';
import LogView from './LogView.vue';
import { useEventsStore } from '../stores/events';
import Exception from './Exception.vue';

const store = useEventsStore()
</script>

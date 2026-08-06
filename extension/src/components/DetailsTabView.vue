<template>
  <div class="flex flex-col h-full min-h-0 w-full">
    <Tabbed v-model:active-index="activeIndex">
      <TabPanel header="Timeline" :pt="panelPt">
        <Timeline v-if="store.selectedRequest" @navigate="onTimelineNavigate" />
      </TabPanel>
      <TabPanel header="Params" :pt="panelPt">
        <ActionParams v-if="store.selectedRequest" />
      </TabPanel>
      <TabPanel header="Rendering" :pt="panelPt">
        <ActionViewRenders v-if="store.selectedRequest" />
      </TabPanel>
      <TabPanel header="Database" :pt="panelPt">
        <ActiveRecordQueries v-if="store.selectedRequest" />
      </TabPanel>
      <TabPanel header="Cache" :pt="panelPt">
        <Cache v-if="store.selectedRequest" />
      </TabPanel>
      <TabPanel header="Log" :pt="panelPt">
        <LogView v-if="store.selectedRequest" />
      </TabPanel>
      <TabPanel header="Error" :pt="errorPanelPt">
        <Exception v-if="store.selectedRequest" />
      </TabPanel>
      <TabPanel header="Compare" :disabled="!store.compareReady" :pt="panelPt">
        <Compare />
      </TabPanel>
    </Tabbed>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import TabPanel from 'primevue/tabpanel';
import Tabbed from './wrappers/Tabbed.vue'
import Timeline from './Timeline.vue';
import ActiveRecordQueries from './ActiveRecordQueries.vue';
import ActionViewRenders from './ActionViewRenders.vue';
import ActionParams from './ActionParams.vue';
import Cache from './Cache.vue';
import LogView from './LogView.vue';
import Compare from './Compare.vue';
import { useEventsStore } from '../stores/events';
import Exception from './Exception.vue';

const TAB = {
  timeline: 0,
  params: 1,
  rendering: 2,
  database: 3,
  cache: 4,
  log: 5,
  error: 6,
  compare: 7,
}

const CATEGORY_TAB = {
  view: TAB.rendering,
  db: TAB.database,
  cache: TAB.cache,
  error: TAB.error,
}

const TAB_BY_NAME = {
  timeline: TAB.timeline,
  params: TAB.params,
  rendering: TAB.rendering,
  database: TAB.database,
  cache: TAB.cache,
  log: TAB.log,
  error: TAB.error,
  compare: TAB.compare,
}

const store = useEventsStore()
const activeIndex = ref(TAB.timeline)

watch(
  () => store.compareOpenNonce,
  () => {
    if (store.compareReady) {
      activeIndex.value = TAB.compare
    }
  }
)

watch(
  () => store.compareReady,
  (ready) => {
    if (!ready && activeIndex.value === TAB.compare) {
      activeIndex.value = TAB.timeline
    }
  }
)

watch(
  () => store.detailTabNonce,
  () => {
    const name = store.pendingDetailTab
    const index = TAB_BY_NAME[name]
    if (index != null) activeIndex.value = index
  }
)

function onTimelineNavigate(payload) {
  const category = typeof payload === 'string' ? payload : payload?.category
  const keys = typeof payload === 'string' ? [] : (payload?.highlightKeys || [])
  const index = CATEGORY_TAB[category]
  if (index == null) return
  store.setDetailHighlight(keys)
  activeIndex.value = index
}

const panelPt = {
  content: 'h-full min-h-0 overflow-hidden flex flex-col'
}

const errorPanelPt = {
  content: 'h-full min-h-0 overflow-hidden flex flex-col',
  headerAction: ({ context }) => ({
    class: context?.active
      ? [
          '!border-red-600 dark:!border-red-500',
          '!text-red-600 dark:!text-red-400',
          'focus-visible:!ring-red-500 dark:focus-visible:!ring-red-400',
        ]
      : undefined
  })
}
</script>

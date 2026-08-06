<template>
<Requests class="h-full min-h-0" />
</template>

<script setup>
import Requests from './components/Requests.vue'
import { fakeEvents, DEMO_COMPARE_IDS } from './fixtures/fakeEvents'
import { useEventsStore } from './stores/events';
import { useSettingsStore } from './stores/settings';
import { isExtensionContextValid } from './theme'
import { onMounted, onUnmounted, nextTick } from 'vue'

const eventsStore = useEventsStore();
const settingsStore = useSettingsStore();

onUnmounted(() => eventsStore.clear());

onMounted(() => {
  if (typeof chrome === 'undefined' || typeof chrome.devtools === 'undefined') {
    console.log("STANDALONE mode... mocking requests");
    fakeEvents.forEach((data) => eventsStore.pushEvents(data.request_id, data.events));
    eventsStore.setCompareSlot(DEMO_COMPARE_IDS.a)
    eventsStore.setCompareSlot(DEMO_COMPARE_IDS.b)
    return
  }

  chrome.devtools.network.onRequestFinished.addListener(function(request) {
    if (!isExtensionContextValid()) return

    var headers = request.response.headers;
    var requestId = headers.find(function(x) { return x.name.toLowerCase() == 'x-request-id' });
    var metaRequestVersion = headers.find(function(x) { return x.name.toLowerCase() == 'x-meta-request-version' });
    if (typeof metaRequestVersion != 'undefined') {
      if (!requestId?.value) return
      var url = new URL(request.request.url);
      url.pathname = '/__meta_request/' + requestId.value + '.json';
      url.search = "";
      try {
        chrome.runtime.sendMessage({ action: 'getJSON', url: url.href }, (data) => {
          if (!isExtensionContextValid()) return
          if (chrome.runtime.lastError) return
          if (!data || data.__error || !Array.isArray(data)) return
          const autoReselect = !settingsStore.lockOn;
          eventsStore.pushEvents(requestId.value, data, autoReselect);
          nextTick(() => {
            if (autoReselect) {
              const wrapper = document.querySelector('[data-pc-section="wrapper"]');
              if (wrapper) wrapper.scrollTop = 1000000;
            }
          })
        });
      } catch {
        // Extension was reloaded; close and reopen DevTools.
      }
    };
  });
})

</script>

<template>
<Requests/>
</template>

<script setup>
import Requests from './components/Requests.vue'
import { fakeEvents } from './fixtures/fakeEvents'
import { useEventsStore } from './stores/events';
import { onMounted, onUnmounted, nextTick } from 'vue'

const store = useEventsStore()

onUnmounted(() => store.clear())

onMounted(() => {
  if (typeof chrome.devtools == 'undefined') {
    console.log("STANDALONE mode... mocking requests")
    fakeEvents.forEach((data) => store.pushEvents(data.request_id, data.events));
  } else {
    chrome.devtools.network.onRequestFinished.addListener(function(request) {
      var headers = request.response.headers;
      var requestId = headers.find(function(x) { return x.name.toLowerCase() == 'x-request-id' });
      var metaRequestVersion = headers.find(function(x) { return x.name.toLowerCase() == 'x-meta-request-version' });
      if (typeof metaRequestVersion != 'undefined') {
        //scope.metaRequestVersion = metaRequestVersion.value;
        var url = new URL(request.request.url);
        url.pathname = '/__meta_request/' + requestId.value + '.json';
        url.search = "";
        console.log(url)
        chrome.runtime.sendMessage({action:'getJSON',url:url}, (data) => {
          store.pushEvents(requestId, data);
          nextTick(() => {
            document.querySelectorAll('[data-pc-section="wrapper"]')[0].scrollTop = 1000000
          })
        });
      };
    });
  }
})

</script>
<template>
<span class="fixed right-0 z-10 cursor-pointer space-x-2 text-base p-[6px]">
  <Button size="small" severity="secondary" text outlined rounded class="text-xs" icon="pi pi-ban" label="Clear" @click="eventsStore.clear()"></Button>
  <Button size="small" severity="secondary" text outlined rounded class="text-xs" icon="pi pi-sliders-h" label="Settings" @click="settingsVisible=true"></Button>
</span>
<SettingsDialog v-model:visible="settingsVisible" @save="settingsVisible=false"/>
</template>

<script setup>
import Button from 'primevue/button';
import SettingsDialog from './SettingsDialog.vue';
import { useEventsStore } from '../stores/events';
import { ref } from 'vue';

const settingsVisible = ref(false);

const eventsStore = useEventsStore();
</script>
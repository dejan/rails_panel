<template>
<span class="fixed right-0 z-10  cursor-pointer flex text-base pr-2 pt-[6px] space-x-1  bg-white">
  <span class="flex center"><ToolbarToggle v-model="settingsStore.lockOn" off-icon="pi pi-thumbtack" off-label="Pin" on-icon="pi pi-thumbtack" on-label="Pin" /></span>
  <span class="flex"><ToolbarButton icon="pi pi-ban" label="Clear" @click="eventsStore.clear()" /></span>
  <span class="flex"><ToolbarButton icon="pi pi-sliders-h" label="Settings" @click="settingsVisible=true"/></span>
</span>
<SettingsDialog v-model:visible="settingsVisible" @save="settingsVisible=false"/>
</template>

<script setup>
import ToolbarButton from './wrappers/ToolbarButton.vue';
import ToolbarToggle from './wrappers/ToolbarToggle.vue';
import SettingsDialog from './SettingsDialog.vue';
import { useEventsStore } from '../stores/events';
import { useSettingsStore } from '../stores/settings';
import { ref } from 'vue';

const settingsVisible = ref(false);

const eventsStore = useEventsStore();
const settingsStore = useSettingsStore();
</script>
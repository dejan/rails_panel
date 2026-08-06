<template>
  <div class="flex items-center justify-between gap-2 shrink-0 px-2 py-1
              bg-surface-0 dark:bg-surface-800
              border-b border-surface-200 dark:border-surface-700">
    <span class="text-xs text-surface-500 dark:text-surface-400 truncate tabular-nums" :title="countTitle">
      Rails Panel
      <span v-if="eventsStore.requestCount" class="opacity-80">
        · {{ eventsStore.requestCount }}/{{ settingsStore.requestCap }}
      </span>
    </span>
    <div class="flex items-center gap-1">
      <ToolbarToggle
        v-model="settingsStore.lockOn"
        off-icon="pi pi-thumbtack"
        off-label="Pin"
        on-icon="pi pi-thumbtack"
        on-label="Pin"
        :title="pinTitle"
      />
      <ToolbarButton
        icon="pi pi-history"
        label="Older"
        title="Clear older: keep only the selected request"
        :disabled="eventsStore.requestCount <= 1"
        @click="eventsStore.clearOlder()"
      />
      <ToolbarButton icon="pi pi-ban" label="Clear" title="Clear all requests" @click="eventsStore.clear()" />
      <ToolbarButton icon="pi pi-sliders-h" label="Settings" title="Settings" @click="settingsVisible = true" />
    </div>
    <SettingsDialog v-model:visible="settingsVisible" @save="settingsVisible = false" />
  </div>
</template>

<script setup>
import ToolbarButton from './wrappers/ToolbarButton.vue';
import ToolbarToggle from './wrappers/ToolbarToggle.vue';
import SettingsDialog from './SettingsDialog.vue';
import { useEventsStore } from '../stores/events';
import { useSettingsStore } from '../stores/settings';
import { computed, ref, watch } from 'vue';

const settingsVisible = ref(false);
const eventsStore = useEventsStore();
const settingsStore = useSettingsStore();

const pinTitle = computed(() =>
  settingsStore.lockOn
    ? 'Pin on: keep the current request selected when new ones arrive'
    : 'Pin off: automatically select the latest request'
);

const countTitle = computed(
  () => `${eventsStore.requestCount} stored · cap ${settingsStore.requestCap}`
);

watch(
  () => settingsStore.requestCap,
  (cap) => {
    eventsStore.pruneToCap(cap)
  }
);
</script>

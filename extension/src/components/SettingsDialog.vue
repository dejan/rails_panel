<template>
  <Dialog modal header="Settings" :style="{ width: '24rem' }">
  <div class="flex flex-col space-y-1 pb-5">
    <label class="text-lg my-2">File path links behaviour</label>
    <div class="space-x-2">
      <RadioButton v-model="settingsStore.filepathLinkBehaviour" inputId="radio1" name="filepathLinkBehaviour" value="copy" :pt="preset"/>
      <label for="radio1">Copy the file path to clipboard</label>
    </div>
    <div class="space-x-2 align-baseline">
      <RadioButton v-model="settingsStore.filepathLinkBehaviour" inputId="radio2" name="filepathLinkBehaviour" value="open"  :pt="preset" />
      <label for="radio2">Open the file in editor</label>
      <Dropdown :disabled="settingsStore.filepathLinkBehaviour === 'copy'" v-model="settingsStore.editor" :options="settingsStore.editors" optionLabel="name" class="flex-1" />
    </div>
  </div>
</Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import RadioButton from 'primevue/radiobutton';
import { useSettingsStore } from '../stores/settings';

const settingsStore = useSettingsStore();

const preset = {
  root: ['relative', 'inline-flex', 'align-baseline',  'cursor-pointer', 'select-none', 'top-1']
};
</script>
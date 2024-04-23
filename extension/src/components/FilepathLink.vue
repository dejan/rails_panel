<template>
  <a @click="click" :class="classes">
    {{ normalizedPath }}
    <span class="relative" :class="['duration-300 transition-all', 'z-50', '', 'whitespace-nowrap', afterCopy ? 'opacity-100 left-4' : 'opacity-0 left-0']">
      <span class="absolute text-xs text-green-900 -top-[5px] px-2 z-30 py-1 border-green-700 border  bg-green-100 rounded-md" >
        <i class="pi pi-check"></i> &nbsp; Copied to clipboard!
      </span>
    </span>
  </a>
</template>

<script setup>
import { normalizePath } from './utils/location';
import { ref, computed, watch } from 'vue';
import { useSettingsStore } from '../stores/settings';

const afterCopy = ref(false);

const settingsStore = useSettingsStore();

function click() {
  if (settingsStore.filepathLinkBehaviour === 'open') {
    openInEditor();
  } else {
    if (typeof chrome.runtime == 'undefined') {
      navigator.clipboard.writeText(normalizedPath.value);
    } else {
      chrome.runtime.sendMessage({action:'copyToClipboard', text:normalizedPath.value});
    }
    afterCopy.value = true;
  } 
}

function openInEditor() {
  const editor = settingsStore.editor;
  if (typeof chrome.tabs == 'undefined') {
    window.open(editor.url(props.filepath, props.line || 1));
  } else {
    chrome.tabs.create({ url: editor.url(props.filepath, props.line || 1) });
  }
}

watch(afterCopy, (value) => {
  if (value) {
    setTimeout(() => {
      afterCopy.value = false;
    }, 700);
  }
});

const props = defineProps({
  filepath: String,
  line: {
    type: Number,
    default: null
  }
});


const normalizedPath = computed(() => normalizePath(props.filepath, props.line));

const classes = [
  'text-blue-800',
  'hover:underline',
  'hover:cursor-pointer',
  'whitespace-nowrap',
]
</script>

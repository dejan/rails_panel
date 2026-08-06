<template>
  <a
    @click.stop="click"
    :class="classes"
    :title="normalizedPath"
  >
    {{ normalizedPath }}
    <span class="relative" :class="['duration-300 transition-all', 'z-50', afterCopy ? 'opacity-100 left-4' : 'opacity-0 left-0']">
      <span class="absolute text-xs -top-[5px] px-2 z-30 py-1 border rounded-md rp-toast-ok whitespace-nowrap">
        <i class="pi pi-check"></i> &nbsp; Copied to clipboard!
      </span>
    </span>
  </a>
</template>

<script setup>
import { normalizePath } from './utils/location';
import { ref, computed, watch } from 'vue';
import { useSettingsStore } from '../stores/settings';
import { copyText } from './utils/clipboard';

const afterCopy = ref(false);

const settingsStore = useSettingsStore();

async function click() {
  if (settingsStore.filepathLinkBehaviour === 'open') {
    openInEditor();
  } else {
    const ok = await copyText(normalizedPath.value);
    if (ok) afterCopy.value = true;
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
  },
  truncate: {
    type: Boolean,
    default: true
  }
});


const normalizedPath = computed(() => normalizePath(props.filepath, props.line));

const classes = computed(() => [
  'rp-link',
  'hover:underline',
  'hover:cursor-pointer',
  props.truncate ? 'inline-block max-w-full truncate align-baseline' : 'break-all whitespace-normal',
])
</script>

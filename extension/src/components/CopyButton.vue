<template>
  <button
    type="button"
    class="inline-flex items-center font-medium
           cursor-pointer select-none transition-colors
           text-surface-600 dark:text-surface-300
           bg-surface-100 hover:bg-surface-200
           dark:bg-surface-700 dark:hover:bg-surface-600
           ring-1 ring-surface-200 dark:ring-surface-600"
    :class="compact
      ? 'gap-0.5 rounded px-1 py-px text-[9px] leading-none'
      : 'gap-1 rounded px-1.5 py-0.5 text-[10px]'"
    :title="title || 'Copy to clipboard'"
    @click.stop="onCopy"
  >
    <i
      class="pi"
      :class="[
        copied ? 'pi-check' : 'pi-copy',
        compact ? 'text-[9px]' : 'text-[10px]',
      ]"
    ></i>
    {{ copied ? (compact ? 'OK' : 'Copied') : label }}
  </button>
</template>

<script setup>
import { ref, watch } from 'vue'
import { copyText } from './utils/clipboard'

const props = defineProps({
  text: { type: [String, Number], default: '' },
  getText: { type: Function, default: null },
  label: { type: String, default: 'Copy' },
  title: { type: String, default: '' },
  compact: { type: Boolean, default: false },
})

const copied = ref(false)
let timer = null

async function onCopy() {
  const value = props.getText ? props.getText() : props.text
  const ok = await copyText(value)
  if (!ok) return
  copied.value = true
}

watch(copied, (value) => {
  clearTimeout(timer)
  if (value) {
    timer = setTimeout(() => {
      copied.value = false
    }, 900)
  }
})
</script>

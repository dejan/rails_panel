<template>
  <div class="space-y-2">
    <div class="flex flex-wrap items-center gap-2 justify-between">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 min-w-0 text-left cursor-pointer select-none
               rounded px-0.5 -mx-0.5
               hover:bg-surface-100 dark:hover:bg-surface-800/80"
        :aria-expanded="modelValue"
        @click="toggle"
      >
        <i
          class="pi text-[10px] text-surface-400 dark:text-surface-500 shrink-0"
          :class="modelValue ? 'pi-chevron-down' : 'pi-chevron-right'"
          aria-hidden="true"
        />
        <h3
          class="text-xs font-bold uppercase tracking-wide m-0"
          :class="titleClass"
        >
          {{ title }}
          <span
            class="font-normal normal-case tracking-normal"
            :class="countClass"
          >({{ countLabel }})</span>
        </h3>
      </button>
      <div
        v-if="modelValue && $slots.actions"
        class="flex flex-wrap items-center gap-2"
        @click.stop
      >
        <slot name="actions" />
      </div>
    </div>
    <div v-show="modelValue">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  countLabel: { type: String, required: true },
  modelValue: { type: Boolean, default: true },
  tone: { type: String, default: 'default' }, // 'default' | 'danger'
})

const emit = defineEmits(['update:modelValue'])

const titleClass = computed(() =>
  props.tone === 'danger'
    ? 'text-red-700 dark:text-red-400'
    : 'text-surface-600 dark:text-surface-300'
)

const countClass = computed(() =>
  props.tone === 'danger'
    ? 'text-red-500/70 dark:text-red-400/60'
    : 'text-surface-400'
)

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

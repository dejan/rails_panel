<template>
  <div class="shrink-0 flex items-center gap-2 px-2 py-1.5 border-b border-surface-200 dark:border-surface-700">
    <div class="relative flex-1 min-w-0">
      <i
        class="pi pi-search absolute left-2 top-1/2 -translate-y-1/2 text-[11px]
               text-surface-400 dark:text-surface-500 pointer-events-none"
        aria-hidden="true"
      ></i>
      <input
        :value="modelValue"
        type="search"
        class="w-full h-7 pl-7 pr-7 rounded-md text-[12px] leading-none
               bg-surface-0 dark:bg-surface-900
               text-surface-800 dark:text-surface-100
               placeholder:text-surface-400 dark:placeholder:text-surface-500
               ring-1 ring-surface-200 dark:ring-surface-600
               focus:outline-none focus:ring-primary-500 dark:focus:ring-primary-400"
        :placeholder="placeholder"
        autocomplete="off"
        spellcheck="false"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown.escape.prevent="$emit('update:modelValue', '')"
      />
      <button
        v-if="modelValue"
        type="button"
        class="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center
               size-5 rounded text-surface-400 hover:text-surface-700 dark:hover:text-surface-200
               hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer"
        title="Clear"
        @click="$emit('update:modelValue', '')"
      >
        <i class="pi pi-times text-[10px]" aria-hidden="true"></i>
      </button>
    </div>
    <span
      v-if="modelValue && count != null"
      class="shrink-0 text-[11px] tabular-nums text-surface-400 dark:text-surface-500"
    >
      {{ count }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Filter…',
  },
  /** Optional match count shown when filtering */
  count: {
    type: Number,
    default: null,
  },
})

defineEmits(['update:modelValue'])
</script>

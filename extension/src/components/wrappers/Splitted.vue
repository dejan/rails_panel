<template>
<div ref="rootEl" class="rp-split h-full w-full min-h-0 min-w-0 overflow-hidden">
  <Splitter
    v-if="ready"
    :key="layout"
    class="h-full w-full"
    :layout="layout"
    :gutterSize="4"
    :pt="preset"
  >
    <SplitterPanel
      class="rp-split-panel flex flex-col !min-w-0 !min-h-0 overflow-hidden"
      :size="primarySize"
      :minSize="minPrimary"
    >
      <div class="flex-1 min-h-0 min-w-0 h-full w-full overflow-auto">
        <slot name="left"></slot>
      </div>
    </SplitterPanel>
    <SplitterPanel
      class="rp-split-panel flex flex-col !min-w-0 !min-h-0 overflow-hidden"
      :size="100 - primarySize"
      :minSize="minSecondary"
    >
      <div class="flex-1 min-h-0 min-w-0 h-full w-full overflow-hidden
                  border-surface-200 dark:border-surface-700"
           :class="layout === 'horizontal' ? 'border-l' : 'border-t'">
        <slot name="right"></slot>
      </div>
    </SplitterPanel>
  </Splitter>
</div>
</template>

<script setup>
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'

const BREAKPOINT_HORIZONTAL = 1200

const rootEl = ref(null)
const ready = ref(false)
const layout = ref('vertical')
const primarySize = ref(32)

const minPrimary = computed(() => (layout.value === 'horizontal' ? 22 : 18))
const minSecondary = computed(() => (layout.value === 'horizontal' ? 30 : 25))

function sizeFor(next, width, height) {
  return next === 'horizontal'
    ? Math.round(Math.min(50, Math.max(32, (380 / width) * 100)))
    : Math.round(Math.min(40, Math.max(24, (220 / height) * 100)))
}

function updateLayout() {
  const el = rootEl.value
  if (!el) return

  const { width, height } = el.getBoundingClientRect()
  if (width < 2 || height < 2) return

  // Prefer stacked (vertical). Only go side-by-side on very wide panels.
  const next = width >= BREAKPOINT_HORIZONTAL && width > height * 1.8
    ? 'horizontal'
    : 'vertical'

  if (next === layout.value) return

  layout.value = next
  primarySize.value = sizeFor(next, width, height)
}

let observer = null

onMounted(() => {
  nextTick(() => {
    const el = rootEl.value
    if (el) {
      const { width, height } = el.getBoundingClientRect()
      if (width >= 2 && height >= 2) {
        layout.value = width >= BREAKPOINT_HORIZONTAL && width > height * 1.8
          ? 'horizontal'
          : 'vertical'
        primarySize.value = sizeFor(layout.value, width, height)
      }
    }

    ready.value = true

    if (typeof ResizeObserver !== 'undefined' && rootEl.value) {
      observer = new ResizeObserver(() => updateLayout())
      observer.observe(rootEl.value)
    } else {
      window.addEventListener('resize', updateLayout)
    }
  })
})

onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('resize', updateLayout)
})

const preset = {
  root: ({ props }) => ({
    class: [
      'flex h-full w-full min-h-0 min-w-0 overflow-hidden',
      'bg-surface-0 dark:bg-surface-900',
      'text-surface-700 dark:text-surface-100',
      props.layout === 'vertical' ? 'flex-col' : 'flex-row'
    ]
  }),
  gutter: ({ props }) => ({
    class: [
      'flex',
      'items-center',
      'justify-center',
      'shrink-0',
      'bg-surface-100 dark:bg-surface-800',
      'hover:bg-surface-200 dark:hover:bg-surface-700',
      'transition-colors',
      'z-10',
      {
        'cursor-col-resize w-1': props.layout === 'horizontal',
        'cursor-row-resize h-1': props.layout !== 'horizontal'
      }
    ]
  }),
  gutterhandler: ({ props }) => ({
    class: [
      'bg-surface-400 dark:bg-surface-500',
      'rounded-full',
      {
        'w-1 h-8': props.layout === 'horizontal',
        'w-8 h-1': props.layout !== 'horizontal'
      }
    ]
  })
}
</script>

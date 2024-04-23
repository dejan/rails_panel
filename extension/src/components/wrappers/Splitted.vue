<template>
<Splitter class="h-full" :pt="preset">
  <SplitterPanel class="w-full" :size="20">
    <slot name="left"></slot>
  </SplitterPanel>
  <SplitterPanel class="flex items-center justify-center">
    <div class="flex-1 h-full shadow-2xl shadow-surface-300  ">
    <slot name="right"></slot>
    </div>
  </SplitterPanel>
</Splitter>
</template>

<script setup>
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'

const preset = {
  gutter: ({ props }) => ({
        class: [
          // Flexbox
          'border-l',
          'border-surface-300',
          'flex',
          'items-center',
          'justify-center',
          'shrink-0',
          // Colors
          'bg-surface-0',
          'hover:bg-surface-200',
          'dark:bg-surface-800',
          // Transitions
          'transition-all',
          // 'duration-200',
          // Misc
          {
            'cursor-col-resize': props.layout == 'horizontal',
            'cursor-row-resize': props.layout !== 'horizontal'
          }
        ]
    }),
    gutterhandler: ({ props }) => ({
        class: [
          // Colors
          'bg-surface-0',
          'dark:bg-surface-600',
          // Transitions
          'transition-all',
          'duration-200',
          // Sizing (Conditional)
          {
            'h-0': props.layout == 'horizontal',
            'w-7 h-0': props.layout !== 'horizontal'
          }
        ]
    })    
}
</script>
<template>
  <Button size="small" rounded class="text-xs" :pt="preset" outline :ptOptions="{ mergeSections: false, mergeProps: false }" />
</template>

<script setup>
import Button from 'primevue/button';

const preset = {
  root: ({ props, context, parent }) => ({
    class: [
      'relative',

      // Alignments
      'items-center justify-center inline-flex text-center align-bottom',

      // Sizes & Spacing
      'text-sm',
      {
        'px-2.5 py-1.5 min-w-[2rem]': props.size === null,
        'px-2 py-1': props.size === 'small',
        'px-3 py-2': props.size === 'large'
      },
      {
        'h-8 w-8 p-0': props.label == null && props.icon !== null
      },

      // Shapes
      
      { 'rounded-md': !props.rounded, 'rounded-full': props.rounded },
      { 'rounded-none first:rounded-l-md last:rounded-r-md self-center': parent.instance.$name == 'InputGroup' },
    
      // Colors
      'text-surface-500 hover:bg-surface-200 dark:hover:bg-surface-300 hover:ring-surface-600 dark:hover:ring-surface-300',
      'active:bg-surface-400',
      
      // Disabled
      { 'opacity-60 pointer-events-none cursor-default': context.disabled },

      // Transitions
      'transition duration-200 ease-in-out',

      // Misc
      'cursor-pointer overflow-hidden select-none'
    ]
  }),
  label: ({ props }) => ({
    class: [
      'duration-200',
      'font-semibold',
      {
        'hover:underline': props.link
      },
      { 'flex-1': props.label !== null, 'invisible w-0': props.label == null }
    ]
  }),
  icon: ({ props }) => ({
    class: [
      'mx-0',
      {
        'mr-2': props.iconPos == 'left' && props.label != null,
        'ml-2 order-1': props.iconPos == 'right' && props.label != null,
        'mb-2': props.iconPos == 'top' && props.label != null,
        'mt-2': props.iconPos == 'bottom' && props.label != null
      }
    ]
  }),
  loadingicon: ({ props }) => ({
    class: [
      'h-3 w-3',
      'mx-0',
      {
        'mr-2': props.iconPos == 'left' && props.label != null,
        'ml-2 order-1': props.iconPos == 'right' && props.label != null,
        'mb-2': props.iconPos == 'top' && props.label != null,
        'mt-2': props.iconPos == 'bottom' && props.label != null
      },
      'animate-spin'
    ]
  }),
  badge: ({ props }) => ({
    class: [{ 'ml-2 w-4 h-4 leading-none flex items-center justify-center': props.badge }]
  })
};

</script>
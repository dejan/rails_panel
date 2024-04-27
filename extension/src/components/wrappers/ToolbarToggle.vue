<template>
  <ToggleButton :pt="preset" outline :ptOptions="{ mergeSections: false, mergeProps: false }" />
</template>

<script setup>
import ToggleButton from 'primevue/togglebutton';

const preset = {
  root: {
    class: [
      'border-none',
      'relative',

      // Alignment
      'inline-flex',

      // Misc
      'cursor-pointer',
      'select-none',
    ]
  },
  box: ({ props }) => ({
    class: [
      // Alignments
      'items-center inline-flex flex-1 text-center align-bottom justify-center',

      // Sizes & Spacing
      'px-2 py-1',
      'text-xs',

      // Shapes
      'rounded-xl',


      { 'ring-surface-200 dark:ring-surface-700': !props.invalid },
      {
        'bg-surface-0 dark:bg-surface-900 ': !props.modelValue,
        'bg-surface-600 text-white dark:bg-surface-700': props.modelValue
      },

      // Invalid State
      { 'ring-red-500 dark:ring-red-400': props.invalid },

      // States
      {
        'peer-hover:bg-surface-200': !props.modelValue,
        'peer-hover:bg-surface-700': props.modelValue
      },
      ,

      {
        'peer-focus-visible:ring-2 peer-focus-visible:ring-inset peer-focus-visible:ring-primary-500 dark:peer-focus-visible:ring-primary-400': !props.disabled
      },

      // Transitions
      'transition-all duration-200',

      // Misc
      { 'cursor-pointer': !props.disabled, 'opacity-60 select-none pointer-events-none cursor-default': props.disabled }
    ]
  }),
  label: ({ props }) => ({
    class: [
      'font-semibold text-center w-full',
      {
        'text-surface-500': !props.modelValue,
        'text-white': props.modelValue
      },
    ]
  }),
  input: {
    class: [
      'peer',

      // Size
      'w-full ',
      'h-full',

      // Position
      'absolute',
      'top-0 left-0',
      'z-10',

      // Spacing
      'p-0',
      'm-0',

      // Shape
      'opacity-0',

      // Misc
      'appearance-none',
      'cursor-pointer'
    ]
  },
  icon: ({ props }) => ({
    class: [
      'mr-2',
      {
        'text-surface-500': !props.modelValue,
        'text-white': props.modelValue
      },
      'transition-transform duration-200',
      {
        '-rotate-45': !props.modelValue,
        '-rotate-90': props.modelValue
      },

    ]
  })
};

</script>
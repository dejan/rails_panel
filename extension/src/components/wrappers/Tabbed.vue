<template>
<TabView
  v-model:activeIndex="activeIndex"
  class="h-full min-h-0"
  :pt="preset"
  :ptOptions="{ mergeSections: false, mergeProps: false }"
  :lazy="true"
>
  <slot></slot>
</TabView>
</template>

<script setup>
import TabView from 'primevue/tabview';

const activeIndex = defineModel('activeIndex', { type: Number, default: 0 })

const preset = {
    root: 'flex flex-col h-full min-h-0 bg-surface-100 dark:bg-surface-900',
    navContainer: ({ props }) => ({
        class: [
            'relative shrink-0',
            { 'overflow-hidden': props.scrollable }
        ]
    }),
    navContent: {
        class: [
            'overflow-x-auto overflow-y-hidden overscroll-contain',
            'scroll-smooth',
            '[&::-webkit-scrollbar]:hidden'
        ]
    },
    previousButton: {
        class: [
            'flex items-center justify-center',
            '!absolute',
            'top-0 left-0',
            'z-20',
            'h-full w-10',
            'rounded-none',
            'bg-surface-0 dark:bg-surface-800',
            'text-primary-500 dark:text-primary-400',
            'shadow-md'
        ]
    },
    nextButton: {
        class: [
            'flex items-center justify-center',
            '!absolute',
            'top-0 right-0',
            'z-20',
            'h-full w-10',
            'rounded-none',
            'bg-surface-0 dark:bg-surface-800',
            'text-primary-500 dark:text-primary-400',
            'shadow-md'
        ]
    },
    nav: {
        class: [
            'flex flex-1',
            'list-none',
            'p-0 m-0',
            'bg-surface-0 dark:bg-surface-800',
            'border-b border-surface-200 dark:border-surface-700',
            'text-surface-900 dark:text-surface-100'
        ]
    },
    panelcontainer: 'flex-1 min-h-0 overflow-hidden flex flex-col',
    tabpanel: {
        header: ({ props }) => ({
            class: [
                'mr-0',
                {
                    'opacity-60 cursor-default user-select-none select-none pointer-events-none': props?.disabled
                }
            ]
        }),
        headerAction: ({ parent, context }) => ({
            class: [
                'relative',
                'font-bold',
                'text-sm',
                'flex items-center',
                'pt-2.5 pb-2 px-3',
                '-mb-px',
                'border-b-2',
                'rounded-t-md',
                {
                    'border-surface-200 dark:border-surface-700': parent.state.d_activeIndex !== context.index,
                    'bg-surface-0 dark:bg-surface-800': parent.state.d_activeIndex !== context.index,
                    'text-surface-700 dark:text-surface-300': parent.state.d_activeIndex !== context.index,

                    'bg-surface-0 dark:bg-surface-800': parent.state.d_activeIndex === context.index,
                    'border-primary-500 dark:border-primary-400': parent.state.d_activeIndex === context.index,
                    'text-primary-600 dark:text-primary-300': parent.state.d_activeIndex === context.index
                },
                'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-2 focus-visible:ring-inset',
                'focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',
                {
                    'hover:bg-surface-0 dark:hover:bg-surface-800/80': parent.state.d_activeIndex !== context.index,
                    'hover:border-surface-400 dark:hover:border-surface-600': parent.state.d_activeIndex !== context.index,
                    'hover:text-surface-900 dark:hover:text-surface-100': parent.state.d_activeIndex !== context.index
                },
                'transition-all duration-200',
                'cursor-pointer select-none text-decoration-none',
                'overflow-hidden',
                'whitespace-nowrap'
            ]
        }),
        headerTitle: {
            class: ['leading-none', 'whitespace-nowrap']
        },
        content: {
            class: [
                'p-0',
                'flex-1 min-h-0 overflow-auto',
                'bg-surface-0 dark:bg-surface-800',
                'text-surface-700 dark:text-surface-100',
                'border-0'
            ]
        }
    }
};
</script>

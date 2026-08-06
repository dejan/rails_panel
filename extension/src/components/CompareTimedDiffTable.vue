<template>
  <div
    class="w-full min-w-0 overflow-hidden"
    :class="framed ? 'rounded border border-surface-200 dark:border-surface-700' : ''"
    :title="title"
  >
    <DetailsTable
      :value="value"
      dataKey="_key"
      :state-key="stateKey"
      sortMode="single"
      removableSort
      rowHover
      class="!h-auto cursor-pointer"
      @row-click="onRowClick"
    >
      <Column
        sortable
        field="_sideRank"
        header="Side"
        :style="sideCol"
      >
        <template #body="slotProps">
          <slot name="side" :data="slotProps.data">
            <span
              class="inline-block rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide"
              :class="sideBadgeClass(slotProps.data)"
            >{{ sideLabel(slotProps.data) }}</span>
          </slot>
        </template>
      </Column>

      <Column
        :field="itemField"
        :header="itemHeader"
        :style="colFillWrap"
      >
        <template #body="slotProps">
          <slot name="item" :data="slotProps.data" />
        </template>
      </Column>

      <Column
        v-if="$slots['row-actions']"
        header=""
        :style="actionsCol"
      >
        <template #body="slotProps">
          <div class="inline-flex items-center gap-1.5" @click.stop>
            <slot name="row-actions" :data="slotProps.data" />
          </div>
        </template>
      </Column>

      <Column
        v-if="showHits"
        sortable
        field="hitsB"
        header="Hit/Miss"
        :style="colFit"
        :pt="numCol"
      >
        <template #body="slotProps">
          <span
            class="tabular-nums whitespace-nowrap text-[10px]"
            :class="slotProps.data.hitChanged
              ? 'text-emerald-700 dark:text-emerald-300 font-medium'
              : 'text-surface-600 dark:text-surface-300'"
          >
            {{ slotProps.data.hitsA }}/{{ slotProps.data.missesA }}
            →
            {{ slotProps.data.hitsB }}/{{ slotProps.data.missesB }}
          </span>
        </template>
      </Column>

      <Column
        sortable
        field="countB"
        header="Count"
        :style="colFit"
        :pt="numCol"
      >
        <template #body="slotProps">
          <span class="tabular-nums whitespace-nowrap text-[11px] text-surface-500 dark:text-surface-400">
            {{ slotProps.data.countA }} → {{ slotProps.data.countB }}
          </span>
        </template>
      </Column>

      <Column
        sortable
        field="deltaCount"
        header="Δ Count"
        :style="colFit"
        :pt="deltaNumCol"
      >
        <template #body="slotProps">
          <span
            class="tabular-nums whitespace-nowrap text-[12px] font-semibold"
            :class="deltaClass(slotProps.data.deltaCount)"
          >{{ formatSignedCount(slotProps.data.deltaCount) }}</span>
        </template>
      </Column>

      <Column
        sortable
        field="timeB"
        header="Time"
        :style="colFit"
        :pt="timeColMuted"
      >
        <template #body="slotProps">
          <span class="tabular-nums whitespace-nowrap text-[11px] text-surface-500 dark:text-surface-400">
            {{ formatMs(slotProps.data.timeA) }} → {{ formatMs(slotProps.data.timeB) }}
          </span>
        </template>
      </Column>

      <Column
        sortable
        field="deltaTime"
        header="Δ Time"
        :style="colFit"
        :pt="deltaTimeCol"
      >
        <template #body="slotProps">
          <span
            class="tabular-nums whitespace-nowrap text-[12px] font-semibold"
            :class="deltaClass(slotProps.data.deltaTime)"
            :title="deltaTimeTitle(slotProps.data)"
          >
            {{ formatSignedMs(slotProps.data.deltaTime) }}
            <span
              v-if="deltaTimePct(slotProps.data) != null"
              class="opacity-90 font-medium"
            > ({{ formatSignedPct(deltaTimePct(slotProps.data)) }})</span>
          </span>
        </template>
      </Column>
    </DetailsTable>
  </div>
</template>

<script setup>
import Column from 'primevue/column'
import DetailsTable from './wrappers/DetailsTable.vue'
import { colFill } from './utils/columns'

defineProps({
  value: { type: Array, default: () => [] },
  stateKey: { type: String, required: true },
  itemHeader: { type: String, default: 'Item' },
  itemField: { type: String, default: 'key' },
  showHits: { type: Boolean, default: false },
  framed: { type: Boolean, default: true },
  title: { type: String, default: 'Click a row to open the matching detail tab' },
})

const emit = defineEmits(['row-click'])

function onRowClick(event) {
  if (event?.originalEvent?.target?.closest?.('a, button')) return
  emit('row-click', event?.data || event)
}

const sideCol = {
  width: '1%',
  whiteSpace: 'nowrap',
  overflow: 'visible',
  verticalAlign: 'middle',
}

const colFit = {
  width: '1%',
  whiteSpace: 'nowrap',
  overflow: 'visible',
  verticalAlign: 'top',
}

const actionsCol = {
  width: '1%',
  whiteSpace: 'nowrap',
  overflow: 'visible',
  verticalAlign: 'top',
}

const colFillWrap = {
  ...colFill,
  whiteSpace: 'normal',
  overflow: 'visible',
  textOverflow: 'clip',
  verticalAlign: 'top',
}

const numCol = {
  headerCell: { class: '!text-right' },
  headerContent: { class: 'flex justify-end' },
  bodyCell: { class: '!text-right align-top' },
}

const deltaNumCol = {
  headerCell: { class: '!text-right font-semibold' },
  headerContent: { class: 'flex justify-end' },
  bodyCell: { class: '!text-right align-top' },
}

const timeColMuted = {
  headerCell: { class: '!text-right', style: { paddingRight: '1rem' } },
  headerContent: { class: 'flex justify-end' },
  bodyCell: { class: '!text-right align-top', style: { paddingRight: '1rem' } },
}

const deltaTimeCol = {
  headerCell: { class: '!text-right font-semibold', style: { paddingRight: '1rem' } },
  headerContent: { class: 'flex justify-end' },
  bodyCell: { class: '!text-right align-top', style: { paddingRight: '1rem' } },
}

function formatMs(ms) {
  const n = Number(ms) || 0
  if (n <= 0) return '0 ms'
  if (n < 0.1) return '<0.1 ms'
  if (n < 10) return `${n.toFixed(1)} ms`
  return `${Math.round(n)} ms`
}

function formatSignedMs(ms) {
  const n = Number(ms) || 0
  if (Math.abs(n) < 0.05) return '0 ms'
  const sign = n > 0 ? '+' : '−'
  const abs = Math.abs(n)
  if (abs < 10) return `${sign}${abs.toFixed(1)} ms`
  return `${sign}${Math.round(abs)} ms`
}

function formatSignedPct(pct) {
  const n = Number(pct) || 0
  if (Math.abs(n) < 0.05) return '0%'
  const sign = n > 0 ? '+' : '−'
  return `${sign}${Math.abs(n).toFixed(0)}%`
}

function formatSignedCount(n) {
  const v = Number(n) || 0
  if (v === 0) return '0'
  return v > 0 ? `+${v}` : String(v)
}

/** Δ% relative to baseline (A). */
function deltaTimePct(row) {
  const base = Number(row.timeA) || 0
  const delta = Number(row.deltaTime) || 0
  if (Math.abs(delta) < 0.05) return 0
  if (base < 0.05) return null
  return (delta / base) * 100
}

function deltaTimeTitle(row) {
  const pct = deltaTimePct(row)
  const ms = formatSignedMs(row.deltaTime)
  if (pct == null) return `${ms} (no baseline time on A)`
  return `${ms} (${formatSignedPct(pct)} vs A)`
}

function deltaClass(delta) {
  const n = Number(delta) || 0
  if (Math.abs(n) < 0.05) return 'text-surface-500 dark:text-surface-400'
  if (n < 0) return 'text-emerald-700 dark:text-emerald-400'
  return 'text-red-600 dark:text-red-400'
}

function sideLabel(row) {
  if (row.side === 'onlyA') return 'A'
  if (row.side === 'onlyB') return 'B'
  return 'A-B'
}

function sideBadgeClass(row) {
  if (row.side === 'onlyA') {
    return 'bg-surface-200 text-surface-800 dark:bg-surface-600 dark:text-surface-100'
  }
  if (row.side === 'onlyB') {
    return 'bg-primary-500/20 text-primary-800 dark:text-primary-200 ring-1 ring-primary-500/35'
  }
  return 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300'
}
</script>

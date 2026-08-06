<template>
  <div class="flex flex-col h-full min-h-0 w-full">
    <Toolbar />
    <div class="flex-1 min-h-0 min-w-0 overflow-hidden">
      <Splitted>
        <template v-slot:left>
          <div class="h-full min-h-0 w-full pr-1 flex flex-col">
            <div
              class="shrink-0 flex flex-wrap items-center gap-1 px-1.5 py-1
                     border-b border-surface-200 dark:border-surface-700
                     bg-surface-0 dark:bg-surface-800"
            >
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium
                       cursor-pointer select-none transition-colors
                       text-surface-600 dark:text-surface-300
                       hover:bg-surface-100 dark:hover:bg-surface-700
                       disabled:opacity-40 disabled:pointer-events-none"
                title="Copy selected request JSON to clipboard"
                :disabled="!store.selectedRequest"
                @click="onCopyExport"
              >
                <i class="pi pi-copy text-[10px]"></i>
                Copy
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium
                       cursor-pointer select-none transition-colors
                       text-fuchsia-700 dark:text-fuchsia-300
                       hover:bg-fuchsia-500/10 dark:hover:bg-fuchsia-400/10"
                title="Paste request JSON from clipboard"
                @click="onPasteImport"
              >
                <i class="pi pi-clipboard text-[10px]"></i>
                Paste
              </button>
              <span class="text-surface-300 dark:text-surface-600 select-none px-0.5" aria-hidden="true">·</span>
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium
                       cursor-pointer select-none transition-colors
                       text-surface-600 dark:text-surface-300
                       hover:bg-surface-100 dark:hover:bg-surface-700
                       disabled:opacity-40 disabled:pointer-events-none"
                title="Download selected request as JSON file"
                :disabled="!store.selectedRequest"
                @click="onExportFile"
              >
                <i class="pi pi-download text-[10px]"></i>
                Export
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium
                       cursor-pointer select-none transition-colors
                       text-fuchsia-700 dark:text-fuchsia-300
                       hover:bg-fuchsia-500/10 dark:hover:bg-fuchsia-400/10"
                title="Import request JSON from a file"
                @click="fileInput?.click()"
              >
                <i class="pi pi-upload text-[10px]"></i>
                Import
              </button>
              <input
                ref="fileInput"
                type="file"
                accept="application/json,.json"
                class="hidden"
                @change="onImportFile"
              />
              <span class="text-surface-300 dark:text-surface-600 select-none px-0.5" aria-hidden="true">·</span>
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium
                       cursor-pointer select-none transition-colors
                       text-surface-600 dark:text-surface-300
                       hover:bg-surface-100 dark:hover:bg-surface-700
                       disabled:opacity-40 disabled:pointer-events-none"
                title="Set selected request as compare A/B"
                :disabled="!store.selectedRequest"
                @click="onCompareSelected"
              >
                <i class="pi pi-arrows-h text-[10px]"></i>
                Compare
              </button>
              <button
                v-if="store.compareAId && store.compareBId"
                type="button"
                class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium
                       cursor-pointer select-none transition-colors
                       text-surface-600 dark:text-surface-300
                       hover:bg-surface-100 dark:hover:bg-surface-700"
                title="Swap compare A and B"
                @click="store.swapCompare()"
              >
                Swap
              </button>
              <button
                v-if="store.compareAId || store.compareBId"
                type="button"
                class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium
                       cursor-pointer select-none transition-colors
                       text-surface-600 dark:text-surface-300
                       hover:bg-surface-100 dark:hover:bg-surface-700"
                title="Clear compare slots"
                @click="store.clearCompare()"
              >
                Clear
              </button>
              <span
                v-if="ioMessage"
                class="ml-auto text-[10px] truncate max-w-[9rem]"
                :class="ioError
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-surface-500 dark:text-surface-400'"
                :title="ioMessage"
              >
                {{ ioMessage }}
              </span>
            </div>
            <div class="flex-1 min-h-0 min-w-0">
              <SelectionTable
                v-model:selection="store.selectedRequest"
                :value="store.requests"
                dataKey="id"
                state-key="rp-requests-columns-v9"
                :row-class="requestRowClass"
              >
                <Column field="status" header="Status" :style="colFit" :pt="centeredCol">
                  <template #body="slotProps">
                    <span class="inline-flex items-center justify-center gap-1 min-w-0 max-w-full">
                      <span class="inline-block truncate" :class="classForStatus(slotProps.data.status)">
                        {{ slotProps.data.status }}
                      </span>
                      <span
                        v-if="slotProps.data.hasException && slotProps.data.status < 400"
                        class="shrink-0 rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide
                               bg-red-500/20 text-red-700 dark:text-red-300
                               ring-1 ring-red-500/35"
                        title="Exception on this request"
                      >err</span>
                    </span>
                  </template>
                </Column>
                <Column field="action" header="Action" :style="colFill">
                  <template #body="slotProps">
                    <span class="inline-flex items-center gap-1.5 min-w-0 max-w-full">
                      <span
                        v-if="compareSlot(slotProps.data)"
                        class="shrink-0 rounded px-1 py-px text-[9px] font-bold uppercase tracking-wide"
                        :class="compareSlot(slotProps.data) === 'A'
                          ? 'bg-surface-200 text-surface-800 dark:bg-surface-600 dark:text-surface-100'
                          : 'bg-primary-500/20 text-primary-800 dark:text-primary-200 ring-1 ring-primary-500/35'"
                        :title="compareSlot(slotProps.data) === 'A' ? 'Compare baseline (A)' : 'Compare candidate (B)'"
                      >{{ compareSlot(slotProps.data) }}</span>
                      <span
                        class="min-w-0 truncate font-bold"
                        :class="slotProps.data.isExternal ? 'text-fuchsia-700 dark:text-fuchsia-300' : ''"
                        :title="actionTitle(slotProps.data)"
                      >
                        {{ slotProps.data.action }}
                      </span>
                      <span
                        v-if="slotProps.data.isExternal"
                        class="shrink-0 rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide
                               bg-fuchsia-500/20 text-fuchsia-800 dark:text-fuchsia-200
                               ring-1 ring-fuchsia-500/40"
                        title="Imported from another machine"
                      >ext</span>
                      <span
                        v-if="slotProps.data.hasNPlusOne"
                        class="shrink-0 rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide
                               bg-amber-500/20 text-amber-800 dark:text-amber-300
                               ring-1 ring-amber-500/35"
                        :title="nPlusOneTitle(slotProps.data)"
                      >N+1</span>
                    </span>
                  </template>
                </Column>
                <Column header="" :style="colFit" :pt="centeredCol">
                  <template #body="slotProps">
                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded px-1 py-0.5 text-[10px] font-semibold
                             cursor-pointer select-none transition-colors
                             text-surface-500 dark:text-surface-400
                             hover:bg-surface-200/80 dark:hover:bg-surface-600
                             hover:text-surface-800 dark:hover:text-surface-100"
                      :title="compareButtonTitle(slotProps.data)"
                      @mousedown.stop.prevent
                      @click.stop.prevent="onCompareRow(slotProps.data)"
                    >
                      {{ compareSlot(slotProps.data) ? '×' : '⇄' }}
                    </button>
                  </template>
                </Column>
                <Column field="method" header="Method" :style="colFit" :pt="centeredCol" />
                <Column field="format" header="Format" :style="colFit" :pt="centeredCol">
                  <template #body="slotProps">
                    <span class="block truncate" :title="slotProps.data.format">
                      {{ slotProps.data.format }}
                    </span>
                  </template>
                </Column>
                <Column
                  field="duration"
                  header="Time"
                  :style="colFit"
                  :pt="timeCol"
                >
                  <template #body="slotProps">
                    <span class="block truncate">
                      {{ formatMs(slotProps.data.duration) }}
                    </span>
                  </template>
                </Column>
              </SelectionTable>
            </div>
          </div>
        </template>
        <template v-slot:right>
          <DetailsTabView />
        </template>
      </Splitted>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Toolbar from './Toolbar.vue';
import Splitted from './wrappers/Splitted.vue'
import Column from 'primevue/column'
import SelectionTable from './wrappers/SelectionTable.vue'
import DetailsTabView from './DetailsTabView.vue'
import { useEventsStore } from '../stores/events'
import { colFit, colFill } from './utils/columns'
import { copyText, readClipboardText } from './utils/clipboard'

const store = useEventsStore()
const fileInput = ref(null)
const ioMessage = ref('')
const ioError = ref(false)
let ioTimer = null

const centeredCol = {
  headerCell: { class: '!text-center' },
  headerContent: { class: 'flex justify-center' },
  bodyCell: { class: '!text-center' },
}

const timeCol = {
  headerCell: { class: '!text-center', style: { paddingRight: '1rem' } },
  headerContent: { class: 'flex justify-center' },
  bodyCell: { class: '!text-center', style: { paddingRight: '1rem' } },
}

function flashIo(message, isError = false) {
  clearTimeout(ioTimer)
  ioMessage.value = message
  ioError.value = isError
  ioTimer = setTimeout(() => {
    ioMessage.value = ''
    ioError.value = false
  }, 3500)
}

function safeFilenamePart(text) {
  return String(text || 'request')
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 60)
}

function buildExportPayload() {
  const payload = store.exportRequestJson()
  if (!payload) {
    flashIo('Select a request first', true)
    return null
  }
  return payload
}

async function onCopyExport() {
  try {
    const payload = buildExportPayload()
    if (!payload) return
    const ok = await copyText(JSON.stringify(payload, null, 2))
    flashIo(ok ? 'Copied JSON' : 'Copy failed', !ok)
  } catch (err) {
    flashIo(err?.message || 'Copy failed', true)
  }
}

async function onPasteImport() {
  try {
    const text = await readClipboardText()
    if (!text?.trim()) {
      flashIo('Clipboard empty or unreadable', true)
      return
    }
    const data = JSON.parse(text)
    const action = store.importRequestJson(data)
    flashIo(`Imported ${action.action}`)
  } catch (err) {
    flashIo(err?.message || 'Paste import failed', true)
  }
}

function onExportFile() {
  try {
    const payload = buildExportPayload()
    if (!payload) return
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    a.href = url
    a.download = `rails-panel-${safeFilenamePart(payload.action?.name)}-${stamp}.json`
    a.click()
    URL.revokeObjectURL(url)
    flashIo('Downloaded JSON')
  } catch (err) {
    flashIo(err?.message || 'Export failed', true)
  }
}

async function onImportFile(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    const action = store.importRequestJson(data)
    flashIo(`Imported ${action.action}`)
  } catch (err) {
    flashIo(err?.message || 'Import failed', true)
  }
}

function requestRowClass(data) {
  if (data?.isExternal) {
    return 'bg-fuchsia-500/10 dark:bg-fuchsia-400/10'
  }
  return ''
}

function actionTitle(row) {
  if (row.isExternal) {
    const from = row.importedFrom ? ` · from ${row.importedFrom}` : ''
    return `${row.action} (external${from})`
  }
  return row.action
}

function classForStatus(status) {
  var cls = 'rp-status ';
  switch (true) {
    case (status >= 200) && (status < 300):
      cls += 'rp-status-ok';
      break;
    case (status >= 400) && (status < 600):
      cls += 'rp-status-error';
      break;
    default:
      cls += 'rp-status-info';
  }
  return cls;
}

function formatMs(ms) {
  const n = Number(ms) || 0
  if (n <= 0) return '0 ms'
  if (n < 0.1) return '<0.1 ms'
  if (n < 10) return `${n.toFixed(1)} ms`
  return `${Math.round(n)} ms`
}

function nPlusOneTitle(row) {
  const patterns = row.nPlusOnePatterns || 0
  const queries = row.nPlusOneQueries || 0
  return `Possible N+1 · ${patterns} pattern${patterns === 1 ? '' : 's'} · ${queries} quer${queries === 1 ? 'y' : 'ies'}`
}

function compareSlot(rowOrId) {
  return store.compareSlotFor(rowOrId)
}

function compareButtonTitle(rowOrId) {
  const slot = store.compareSlotFor(rowOrId)
  if (slot) return `Remove from compare (${slot})`
  if (!store.compareAId) return 'Set as compare baseline (A)'
  if (!store.compareBId) return 'Set as compare candidate (B)'
  return 'Replace compare candidate (B)'
}

function onCompareRow(row) {
  if (!row) return
  store.setCompareSlot(row)
}

function onCompareSelected() {
  if (!store.selectedRequest) return
  store.setCompareSlot(store.selectedRequest)
}
</script>

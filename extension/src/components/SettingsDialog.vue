<template>
  <Dialog modal header="Settings" :style="{ width: 'min(28rem, 94vw)' }">
    <div class="flex flex-col gap-5 pb-2 text-sm text-surface-700 dark:text-surface-200">
      <section class="space-y-2">
        <h3 class="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
          File path links
        </h3>
        <div class="space-x-2">
          <RadioButton
            v-model="settingsStore.filepathLinkBehaviour"
            inputId="radio1"
            name="filepathLinkBehaviour"
            value="copy"
            :pt="preset"
          />
          <label for="radio1">Copy the file path to clipboard</label>
        </div>
        <div class="space-x-2 align-baseline">
          <RadioButton
            v-model="settingsStore.filepathLinkBehaviour"
            inputId="radio2"
            name="filepathLinkBehaviour"
            value="open"
            :pt="preset"
          />
          <label for="radio2">Open the file in editor</label>
          <Dropdown
            :disabled="settingsStore.filepathLinkBehaviour === 'copy'"
            v-model="settingsStore.editor"
            :options="settingsStore.editors"
            optionLabel="name"
            class="flex-1"
          />
        </div>
      </section>

      <section class="space-y-2">
        <h3 class="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
          Memory
        </h3>
        <label class="flex items-center justify-between gap-3">
          <span>Keep last N requests</span>
          <input
            v-model.number="settingsStore.requestCap"
            type="number"
            min="10"
            max="1000"
            step="10"
            class="w-20 rounded border border-surface-300 dark:border-surface-600
                   bg-surface-0 dark:bg-surface-900 px-2 py-1 text-right tabular-nums"
          />
        </label>
        <p class="text-[11px] text-surface-500 dark:text-surface-400 m-0">
          Older requests are dropped automatically when the cap is exceeded.
        </p>
      </section>

      <section class="space-y-2">
        <h3 class="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
          Timeline markers
        </h3>
        <label class="flex items-center justify-between gap-3">
          <span>Slow / Heavy ≥ ms</span>
          <input
            v-model.number="settingsStore.outlierMs"
            type="number"
            min="50"
            max="10000"
            step="50"
            class="w-20 rounded border border-surface-300 dark:border-surface-600
                   bg-surface-0 dark:bg-surface-900 px-2 py-1 text-right tabular-nums"
          />
        </label>
        <label class="flex items-center justify-between gap-3">
          <span>Slow / Heavy ≥ % of request</span>
          <input
            v-model.number="settingsStore.outlierPct"
            type="number"
            min="1"
            max="50"
            step="1"
            class="w-20 rounded border border-surface-300 dark:border-surface-600
                   bg-surface-0 dark:bg-surface-900 px-2 py-1 text-right tabular-nums"
          />
        </label>
        <label class="flex items-center justify-between gap-3">
          <span>Other gap ≥ ms</span>
          <input
            v-model.number="settingsStore.idleGapMs"
            type="number"
            min="20"
            max="10000"
            step="10"
            class="w-20 rounded border border-surface-300 dark:border-surface-600
                   bg-surface-0 dark:bg-surface-900 px-2 py-1 text-right tabular-nums"
          />
        </label>
        <label class="flex items-center justify-between gap-3">
          <span>Other gap ≥ % of request</span>
          <input
            v-model.number="settingsStore.idleGapPct"
            type="number"
            min="1"
            max="50"
            step="1"
            class="w-20 rounded border border-surface-300 dark:border-surface-600
                   bg-surface-0 dark:bg-surface-900 px-2 py-1 text-right tabular-nums"
          />
        </label>
        <label class="flex items-center justify-between gap-3">
          <span>N+1 min repeats</span>
          <input
            v-model.number="settingsStore.nPlusOneMin"
            type="number"
            min="2"
            max="50"
            step="1"
            class="w-20 rounded border border-surface-300 dark:border-surface-600
                   bg-surface-0 dark:bg-surface-900 px-2 py-1 text-right tabular-nums"
          />
        </label>
        <p class="text-[11px] text-surface-500 dark:text-surface-400 m-0">
          Defaults: Slow/Heavy ≥300 ms, or ≥10% **and** ≥75 ms (avoids noise on tiny requests).
        </p>
      </section>

      <section class="space-y-2">
        <h3 class="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
          Compare time noise
        </h3>
        <label class="flex items-center justify-between gap-3">
          <span>Diff / Slower / Faster ≥ ms</span>
          <input
            v-model.number="settingsStore.compareDiffMs"
            type="number"
            min="0"
            max="1000"
            step="1"
            class="w-20 rounded border border-surface-300 dark:border-surface-600
                   bg-surface-0 dark:bg-surface-900 px-2 py-1 text-right tabular-nums"
          />
        </label>
        <label class="flex items-center justify-between gap-3">
          <span>…or ≥ % of row time</span>
          <input
            v-model.number="settingsStore.compareDiffPct"
            type="number"
            min="0"
            max="50"
            step="1"
            class="w-20 rounded border border-surface-300 dark:border-surface-600
                   bg-surface-0 dark:bg-surface-900 px-2 py-1 text-right tabular-nums"
          />
        </label>
        <p class="text-[11px] text-surface-500 dark:text-surface-400 m-0">
          A time change counts when |Δ| &gt; max(ms, % × max(time A, time B)).
          Default: max(1 ms, 5%).
        </p>
        <label class="flex items-center justify-between gap-3 pt-1">
          <span>Compact SQL rows</span>
          <input
            v-model="settingsStore.compareCompactSql"
            type="checkbox"
            class="accent-primary-500"
          />
        </label>
        <p class="text-[11px] text-surface-500 dark:text-surface-400 m-0">
          One-line SQL preview in Compare (use Expand for the full query).
        </p>
      </section>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import RadioButton from 'primevue/radiobutton'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()

const preset = {
  root: ['relative', 'inline-flex', 'align-baseline', 'cursor-pointer', 'select-none', 'top-1'],
}
</script>

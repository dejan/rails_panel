<template>
  <div v-if="timeline" class="h-full min-h-0 w-full overflow-auto p-3 space-y-3">
    <Teleport to="body">
      <div
        v-if="hoverTip.visible"
        class="pointer-events-none fixed z-[10000] max-w-xs rounded px-2 py-1 text-[11px] leading-snug
               whitespace-pre-line shadow-lg
               bg-surface-900 text-surface-0 dark:bg-surface-100 dark:text-surface-900"
        :style="hoverTipStyle"
      >
        {{ hoverTip.text }}
      </div>
    </Teleport>
    <div class="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs text-surface-600 dark:text-surface-300">
      <span>
        <span class="font-semibold text-surface-800 dark:text-surface-100">Total</span>
        {{ formatMs(timeline.totalMs) }}
      </span>
      <span>
        <span class="font-semibold text-amber-700 dark:text-amber-400">View</span>
        {{ formatMs(timeline.viewRuntime) }}
      </span>
      <span>
        <span class="font-semibold text-sky-700 dark:text-sky-400">DB</span>
        {{ formatMs(timeline.dbRuntime) }}
      </span>
      <span v-if="timeline.cacheRuntime > 0">
        <span class="font-semibold text-emerald-700 dark:text-emerald-400">Cache</span>
        {{ formatMs(timeline.cacheRuntime) }}
      </span>
      <span>
        <span class="font-semibold text-surface-500">Other</span>
        {{ formatMs(timeline.otherRuntime) }}
      </span>
    </div>

    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-surface-500 dark:text-surface-400">
      <button
        v-for="item in visibleLegend"
        :key="item.category"
        type="button"
        class="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 transition-colors
               hover:bg-surface-100 dark:hover:bg-surface-700/50 cursor-pointer select-none"
        :class="filterClass(item.category)"
        :title="filterTitle(item.category)"
        @click="toggleFilter(item.category)"
      >
        <span class="inline-block h-2.5 w-2.5 rounded-sm" :class="item.swatch"></span>
        {{ item.label }}
      </button>

      <span class="text-surface-300 dark:text-surface-600 select-none" aria-hidden="true">·</span>

      <div class="inline-flex items-center rounded ring-1 ring-surface-200 dark:ring-surface-600 overflow-hidden">
        <button
          type="button"
          class="px-1.5 py-0.5 transition-colors cursor-pointer select-none"
          :class="groupMode === 'all'
            ? 'bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-100'
            : 'hover:bg-surface-100 dark:hover:bg-surface-700/50'"
          title="Show all events (view/TRANSACTION nesting only)"
          @click="setGroupMode('all')"
        >
          All
        </button>
        <button
          type="button"
          class="px-1.5 py-0.5 transition-colors cursor-pointer select-none"
          :class="groupMode === 'caller'
            ? 'bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-100'
            : 'hover:bg-surface-100 dark:hover:bg-surface-700/50'"
          title="Group consecutive SQL/cache by Ruby caller"
          @click="setGroupMode('caller')"
        >
          Caller
        </button>
        <button
          type="button"
          class="px-1.5 py-0.5 transition-colors cursor-pointer select-none"
          :class="groupMode === 'type'
            ? 'bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-100'
            : 'hover:bg-surface-100 dark:hover:bg-surface-700/50'"
          title="Group by View / Database / Cache"
          @click="setGroupMode('type')"
        >
          Type
        </button>
      </div>

      <div
        v-if="groupMode === 'caller'"
        class="inline-flex items-center rounded ring-1 ring-surface-200 dark:ring-surface-600 overflow-hidden"
      >
        <button
          type="button"
          class="px-1.5 py-0.5 transition-colors cursor-pointer select-none"
          :class="callerGrain === 'file'
            ? 'bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-100'
            : 'hover:bg-surface-100 dark:hover:bg-surface-700/50'"
          title="Group by Ruby file only"
          @click="setCallerGrain('file')"
        >
          File
        </button>
        <button
          type="button"
          class="px-1.5 py-0.5 transition-colors cursor-pointer select-none"
          :class="callerGrain === 'method'
            ? 'bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-100'
            : 'hover:bg-surface-100 dark:hover:bg-surface-700/50'"
          title="Group by Ruby file#method"
          @click="setCallerGrain('method')"
        >
          Method
        </button>
      </div>

      <button
        type="button"
        class="rounded px-1.5 py-0.5 transition-colors cursor-pointer select-none
               hover:bg-surface-100 dark:hover:bg-surface-700/50"
        :class="hideFast
          ? 'bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-100 ring-1 ring-surface-300 dark:ring-surface-500'
          : ''"
        :title="hideFast ? 'Showing events ≥ 1 ms (click to show all)' : 'Hide events under 1 ms'"
        @click="hideFast = !hideFast"
      >
        Hide &lt;1 ms
        <span v-if="hideFast && hiddenFastCount" class="tabular-nums opacity-70">· {{ hiddenFastCount }}</span>
      </button>

      <template v-if="nestParentIds.length">
        <span class="text-surface-300 dark:text-surface-600 select-none" aria-hidden="true">·</span>
        <button
          type="button"
          class="rounded px-1.5 py-0.5 transition-colors
                 hover:bg-surface-100 dark:hover:bg-surface-700/50
                 hover:text-surface-800 dark:hover:text-surface-100
                 cursor-pointer select-none"
          title="Expand all nested rows"
          @click="expandAll"
        >
          Expand all
        </button>
        <button
          type="button"
          class="rounded px-1.5 py-0.5 transition-colors
                 hover:bg-surface-100 dark:hover:bg-surface-700/50
                 hover:text-surface-800 dark:hover:text-surface-100
                 cursor-pointer select-none"
          title="Collapse all nested rows"
          @click="collapseAll"
        >
          Collapse all
        </button>
      </template>

      <template v-if="markerLegend.length">
        <span class="text-surface-300 dark:text-surface-600 select-none" aria-hidden="true">·</span>
        <button
          v-for="item in markerLegend"
          :key="item.key"
          type="button"
          class="inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors
                 cursor-pointer select-none
                 hover:bg-surface-100 dark:hover:bg-surface-700/50"
          :class="markerFilterClass(item)"
          :title="markerFilterTitle(item)"
          :disabled="item.key === 'gap'"
          @click="toggleMarkerFilter(item.key)"
        >
          <span class="rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide" :class="item.badgeClass">
            {{ item.label }}
          </span>
          <span class="tabular-nums opacity-70">{{ item.count }}</span>
        </button>
      </template>
    </div>

    <div class="min-w-0">
      <div class="flex items-center gap-2 mb-1 text-[10px] text-surface-400 dark:text-surface-500">
        <div class="w-48 shrink-0"></div>
        <div class="relative flex-1 h-4">
          <span
            v-for="tick in ticks"
            :key="tick.pct"
            class="absolute top-0 whitespace-nowrap"
            :class="tick.pct === 0
              ? 'translate-x-0'
              : tick.pct === 100
                ? '-translate-x-full'
                : '-translate-x-1/2'"
            :style="{ left: tick.pct + '%' }"
          >
            {{ tick.label }}
          </span>
          <div
            v-for="gap in idleGaps"
            :key="'axis-gap-' + gap.startMs"
            class="absolute bottom-0 h-1 rounded-sm cursor-help z-[1]
                   bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,rgba(120,113,108,0.55)_2px,rgba(120,113,108,0.55)_4px)]
                   dark:bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,rgba(168,162,158,0.55)_2px,rgba(168,162,158,0.55)_4px)]"
            :style="gapStyle(gap)"
            @mouseenter="onTipEnter(gap.title, $event)"
            @mousemove="onTipMove($event)"
            @mouseleave="onTipLeave"
          ></div>
        </div>
        <div class="w-14 shrink-0"></div>
      </div>

      <div
        v-for="span in visibleSpans"
        :key="span.id"
        class="min-w-0"
      >
        <div
          class="flex items-center gap-2 py-0.5 min-w-0 px-0.5"
          :class="rowClass(span)"
          @click="onRowClick(span)"
          @mouseenter="onTipEnter(rowTitle(span), $event)"
          @mousemove="onTipMove($event)"
          @mouseleave="onTipLeave"
        >
          <div
            class="w-48 h-5 shrink-0 min-w-0 flex items-center text-xs leading-none"
            :class="labelClass(span)"
          >
            <span
              class="inline-flex items-center justify-center shrink-0 self-stretch"
              :style="{ paddingLeft: `${(span.nestDepth || 0) * 0.55}rem` }"
            >
              <button
                v-if="childCount(span.id)"
                type="button"
                class="inline-flex items-center justify-center size-3.5 mr-0.5 rounded
                       text-surface-500 dark:text-surface-400
                       hover:bg-surface-200 dark:hover:bg-surface-600
                       hover:text-surface-800 dark:hover:text-surface-100
                       cursor-pointer"
                :title="isExpanded(span.id) ? 'Collapse nested' : `Expand ${childCount(span.id)} nested`"
                :aria-expanded="isExpanded(span.id)"
                @click="toggleExpand(span.id, $event)"
              >
                <svg
                  class="size-2.5 shrink-0 transition-transform duration-100"
                  :class="isExpanded(span.id) ? 'rotate-90' : ''"
                  viewBox="0 0 10 10"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M3.2 1.5v7L8 5.5 3.2 1.5z" />
                </svg>
              </button>
              <span
                v-else
                class="inline-block size-3.5 mr-0.5"
                aria-hidden="true"
              ></span>
            </span>
            <span
              class="inline-block size-1.5 rounded-full mr-1.5 shrink-0"
              :class="dotClass(span.category, span)"
            ></span>
            <span
              class="min-w-0 truncate"
              :class="span.category === 'error' || (span.category === 'request' && span.hasError)
                ? 'font-medium'
                : undefined"
            >
              {{ span.label }}
            </span>
            <span
              v-if="childCount(span.id) && !isExpanded(span.id)"
              class="ml-1 shrink-0 text-[10px] tabular-nums"
              :class="span.category === 'error'
                ? 'text-white/70'
                : 'text-surface-400 dark:text-surface-500'"
            >+{{ childCount(span.id) }}</span>
            <span
              v-for="marker in spanMarkers(span)"
              :key="marker.key"
              class="ml-1 shrink-0 rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide"
              :class="marker.badgeClass"
              :title="marker.title"
            >{{ marker.label }}</span>
          </div>

          <div
            class="relative flex-1 h-5 min-w-0 rounded-sm overflow-hidden"
            :class="[
              span.category === 'error'
                ? 'bg-transparent'
                : 'bg-surface-200/60 dark:bg-surface-800/80',
              span.category === 'request' && span.hasError
                ? 'ring-1 ring-inset ring-red-500/70 dark:ring-red-400/70'
                : '',
            ]"
          >
            <div
              v-for="tick in guideTicks"
              :key="'guide-' + span.id + '-' + tick.pct"
              class="pointer-events-none absolute inset-y-0 z-0 w-0
                     border-l border-dashed border-surface-400/45 dark:border-surface-500/55"
              :style="{ left: tick.pct + '%' }"
              aria-hidden="true"
            ></div>
            <template v-if="span.category === 'request'">
              <div class="absolute inset-y-0.5 inset-x-0 z-[1] flex overflow-hidden rounded-sm">
                <div
                  v-for="seg in requestSegments"
                  :key="seg.key"
                  class="h-full min-w-0 flex items-center justify-center overflow-hidden"
                  :class="seg.barClass"
                  :style="{ width: seg.pct + '%' }"
                  @mouseenter="onTipEnter(seg.title, $event)"
                  @mousemove="onTipMove($event)"
                >
                  <span
                    v-if="seg.pct >= 14"
                    class="px-0.5 text-[9px] leading-none font-medium text-white/95 truncate"
                  >
                    {{ seg.shortLabel }}
                  </span>
                </div>
              </div>
            </template>
            <div
              v-else-if="span.category === 'error'"
              class="absolute inset-0 z-[1] flex items-center px-2 text-[11px] font-medium text-white truncate"
            >
              {{ span.detail }}
            </div>
            <div
              v-else
              class="absolute top-0.5 bottom-0.5 z-[1] rounded-sm min-w-[2px]"
              :class="[barClass(span.category), barMarkerClass(span)]"
              :style="barStyle(span)"
            ></div>
          </div>

          <div
            class="w-14 shrink-0 text-right text-[11px] tabular-nums"
            :class="durationClass(span)"
          >
            <span v-if="span.category === 'error'">err</span>
            <template v-else>{{ formatMs(displayDuration(span)) }}</template>
          </div>
        </div>

        <div
          v-if="span.category === 'error' && span.frames?.length"
          class="flex gap-2 mb-1 rounded-b-sm bg-red-600/10 dark:bg-red-500/10"
        >
          <div class="w-48 shrink-0"></div>
          <div class="flex-1 min-w-0 space-y-0.5 px-2 py-1">
            <button
              v-for="(frame, index) in span.frames.slice(0, 8)"
              :key="index"
              type="button"
              class="flex w-full items-start gap-1.5 text-left text-[11px] font-mono
                     text-red-800 dark:text-red-200
                     hover:underline cursor-pointer"
              :title="frame"
              @click.stop="emit('navigate', { category: 'error', highlightKeys: span.highlightKeys || [] })"
            >
              <span class="shrink-0 text-red-500 dark:text-red-400" aria-hidden="true">↳</span>
              <span class="min-w-0 truncate">{{ shortenFrame(frame) }}</span>
            </button>
            <button
              v-if="span.frames.length > 8"
              type="button"
              class="text-[10px] text-red-600 dark:text-red-300 pl-4 cursor-pointer hover:underline"
              @click.stop="emit('navigate', { category: 'error', highlightKeys: span.highlightKeys || [] })"
            >
              +{{ span.frames.length - 8 }} more — open Error
            </button>
          </div>
          <div class="w-14 shrink-0"></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="p-2 text-sm text-surface-600 dark:text-surface-300">
    No timing data for this request.
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useEventsStore } from '../stores/events'
import { useSettingsStore } from '../stores/settings'
import { annotateQueryRepeats } from './utils/sqlPatterns'

const emit = defineEmits(['navigate'])

const store = useEventsStore()
const settings = useSettingsStore()
const categoryFilter = ref(null)
/** Marker filter: 'n1' | 'slow' | 'heavy' (legend badges also act as filters). */
const markerFilter = ref(null)
/** Parent span ids the user has collapsed. Nested rows start expanded (caller mode). */
const collapsedIds = ref(new Set())
/** all = flat+natural nest; caller = by Ruby file/method; type = View/DB/Cache */
const groupMode = ref('all')
/** Caller grain: file only vs file#method (default). */
const callerGrain = ref('method')
/** Hide leaf events under 1ms to cut noise */
const hideFast = ref(true)
const FAST_MS = 1

const outlierMs = computed(() => settings.outlierMs)
const outlierPct = computed(() => settings.outlierPct / 100)
const idleGapMs = computed(() => settings.idleGapMs)
const idleGapPct = computed(() => settings.idleGapPct / 100)

/** Custom hover tip — native title is flaky in DevTools (delay + nested titles). */
const hoverTip = ref({ visible: false, text: '', x: 0, y: 0 })
let tipShowTimer = null

const hoverTipStyle = computed(() => {
  const pad = 12
  const x = Math.min(hoverTip.value.x + pad, window.innerWidth - 8)
  const y = Math.min(hoverTip.value.y + pad, window.innerHeight - 8)
  return {
    left: `${x}px`,
    top: `${y}px`,
    transform: x > window.innerWidth - 200 ? 'translateX(-100%)' : undefined,
  }
})

function onTipEnter(text, event) {
  clearTimeout(tipShowTimer)
  hoverTip.value.text = text || ''
  hoverTip.value.x = event.clientX
  hoverTip.value.y = event.clientY
  if (!text) {
    hoverTip.value.visible = false
    return
  }
  if (hoverTip.value.visible) return
  tipShowTimer = setTimeout(() => {
    hoverTip.value.visible = true
  }, 120)
}

function onTipMove(event) {
  if (!hoverTip.value.text) return
  hoverTip.value.x = event.clientX
  hoverTip.value.y = event.clientY
}

function onTipLeave() {
  clearTimeout(tipShowTimer)
  tipShowTimer = null
  hoverTip.value.visible = false
  hoverTip.value.text = ''
}

onBeforeUnmount(() => {
  clearTimeout(tipShowTimer)
})

const timeline = computed(() => store.selectedTimeline)

const annotatedQueries = computed(() =>
  annotateQueryRepeats(store.selectedActiveRecordQueries || [], {
    nPlusOneMin: settings.nPlusOneMin,
  })
)

const nPlusOneKeys = computed(() => {
  const keys = new Set()
  for (const q of annotatedQueries.value) {
    if (q.isNPlusOne && q.sourceKey) keys.add(q.sourceKey)
  }
  return keys
})

const modeSpans = computed(() => {
  const t = timeline.value
  if (!t) return []
  if (groupMode.value === 'type') return t.spansByType || t.spans || []
  if (groupMode.value === 'caller') {
    if (callerGrain.value === 'file') {
      return t.spansByCallerFile || t.spansByCaller || t.spans || []
    }
    return t.spansByCaller || t.spans || []
  }
  return t.spans || []
})

/** Uninstrumented gaps (Other) between covered DB/View/Cache intervals. */
const idleGaps = computed(() => {
  const t = timeline.value
  if (!t) return []
  const total = t.totalMs || 0
  if (total <= 0) return []
  const minGap = Math.max(idleGapMs.value, total * idleGapPct.value)

  const intervals = (t.spans || [])
    .filter((s) => s.sourceKey && (s.category === 'db' || s.category === 'view' || s.category === 'cache'))
    .map((s) => {
      const start = Math.max(0, Number(s.startMs) || 0)
      const dur = Math.max(0, s.durationInclusiveMs ?? s.durationMs ?? 0)
      return { start, end: Math.min(total, start + dur) }
    })
    .filter((iv) => iv.end > iv.start)
    .sort((a, b) => a.start - b.start || a.end - b.end)

  const merged = []
  for (const iv of intervals) {
    const last = merged[merged.length - 1]
    if (!last || iv.start > last.end) merged.push({ ...iv })
    else last.end = Math.max(last.end, iv.end)
  }

  const gaps = []
  let cursor = 0
  for (const iv of merged) {
    const gapMs = iv.start - cursor
    if (gapMs >= minGap) {
      gaps.push({
        startMs: cursor,
        durationMs: gapMs,
        title: `Other gap · ${formatMs(gapMs)} · +${formatMs(cursor)} (uninstrumented)`,
      })
    }
    cursor = Math.max(cursor, iv.end)
  }
  const tail = total - cursor
  if (tail >= minGap) {
    gaps.push({
      startMs: cursor,
      durationMs: tail,
      title: `Other gap · ${formatMs(tail)} · +${formatMs(cursor)} (uninstrumented)`,
    })
  }
  return gaps
})

const markerLegend = computed(() => {
  let nPlusOne = 0
  let slow = 0
  let heavy = 0
  for (const span of modeSpans.value) {
    if (span.isCallerGroup || span.isTypeGroup || span.isTransactionGroup) continue
    if (span.category === 'request' || span.category === 'error') continue
    if (hasNPlusOne(span)) nPlusOne += 1
    else if (isOutlier(span)) {
      if (span.category === 'view') heavy += 1
      else if (span.category === 'db') slow += 1
    }
  }
  const items = []
  if (nPlusOne) {
    items.push({
      key: 'n1',
      label: 'N+1',
      count: nPlusOne,
      title: `Repeated SQL pattern (≥${settings.nPlusOneMin}) — possible N+1`,
      badgeClass: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 ring-1 ring-amber-500/35',
    })
  }
  if (slow) {
    items.push({
      key: 'slow',
      label: 'Slow',
      count: slow,
      title: outlierTitle('db'),
      badgeClass: 'bg-orange-500/20 text-orange-800 dark:text-orange-300 ring-1 ring-orange-500/35',
    })
  }
  if (heavy) {
    items.push({
      key: 'heavy',
      label: 'Heavy',
      count: heavy,
      title: outlierTitle('view'),
      badgeClass: 'bg-rose-500/20 text-rose-800 dark:text-rose-300 ring-1 ring-rose-500/35',
    })
  }
  if (idleGaps.value.length) {
    items.push({
      key: 'gap',
      label: 'Gap',
      count: idleGaps.value.length,
      title: `Large uninstrumented Other gaps (≥${idleGapMs.value} ms and ≥${settings.idleGapPct}%)`,
      badgeClass: 'bg-surface-300/60 dark:bg-surface-600/60 text-surface-700 dark:text-surface-200 ring-1 ring-surface-400/40',
    })
  }
  return items
})

const legend = [
  { category: 'request', label: 'Request', swatch: 'bg-surface-400 dark:bg-surface-500' },
  { category: 'view', label: 'View', swatch: 'bg-amber-500' },
  { category: 'db', label: 'Database', swatch: 'bg-sky-500' },
  { category: 'cache', label: 'Cache', swatch: 'bg-emerald-500' },
  { category: 'error', label: 'Error', swatch: 'bg-red-500' },
]

const presentCategories = computed(() => {
  const set = new Set()
  for (const span of modeSpans.value) {
    set.add(span.category)
  }
  return set
})

const visibleLegend = computed(() =>
  legend.filter((item) => presentCategories.value.has(item.category))
)

/** Map child span id → parent span id (from nestDepth + time containment). */
const parentById = computed(() => {
  const spans = modeSpans.value
  const map = new Map()
  for (let i = 0; i < spans.length; i++) {
    const span = spans[i]
    const depth = span.nestDepth || 0
    if (depth <= 0) continue
    const parent = findParent(spans, i)
    if (parent) map.set(span.id, parent.id)
  }
  return map
})

const childCountById = computed(() => {
  const counts = new Map()
  for (const parentId of parentById.value.values()) {
    counts.set(parentId, (counts.get(parentId) || 0) + 1)
  }
  return counts
})

const nestParentIds = computed(() => Array.from(childCountById.value.keys()))

const hiddenFastCount = computed(() => {
  if (!hideFast.value) return 0
  return modeSpans.value.filter((span) => isFastLeaf(span)).length
})

const visibleSpans = computed(() => {
  let spans = modeSpans.value
  if (categoryFilter.value) {
    spans = spans.filter((span) => span.category === categoryFilter.value)
  }
  if (markerFilter.value) {
    spans = spans.filter((span) => spanMatchesMarker(span, markerFilter.value))
  }
  return spans.filter((span) => {
    if (!isNestVisible(span)) return false
    if (hideFast.value && isFastLeaf(span)) {
      // Keep fast N+1 rows visible when filtering by marker.
      if (!(markerFilter.value && spanMatchesMarker(span, markerFilter.value))) return false
    }
    return true
  })
})

const requestSegments = computed(() => {
  const t = timeline.value
  if (!t) return []
  const total = t.totalMs || 1
  const parts = [
    {
      key: 'view',
      label: 'View',
      ms: t.viewRuntime || 0,
      barClass: 'bg-amber-500/90 dark:bg-amber-400/90',
    },
    {
      key: 'db',
      label: 'DB',
      ms: t.dbRuntime || 0,
      barClass: 'bg-sky-500/90 dark:bg-sky-400/90',
    },
    {
      key: 'cache',
      label: 'Cache',
      ms: t.cacheRuntime || 0,
      barClass: 'bg-emerald-500/90 dark:bg-emerald-400/90',
    },
    {
      key: 'other',
      label: 'Other',
      ms: Math.max(0, t.otherRuntime || 0),
      barClass: 'bg-surface-400/80 dark:bg-surface-500/80',
    },
  ]
  return parts
    .filter((part) => part.ms > 0.0005)
    .map((part) => {
      const pct = Math.max(0, Math.min(100, (part.ms / total) * 100))
      return {
        ...part,
        pct,
        shortLabel: `${part.label} ${formatPct(pct)}`,
        title: `${part.label}: ${formatMs(part.ms)} · ${formatPct(pct)} of request`,
      }
    })
})

const requestBreakdownTitle = computed(() =>
  requestSegments.value.map((seg) => seg.title).join('\n')
)

watch(
  () => store.selectedRequest?.id,
  () => {
    categoryFilter.value = null
    markerFilter.value = null
    collapsedIds.value = new Set()
    if (groupMode.value === 'type') {
      collapseTypeGroups()
    }
  }
)

watch(presentCategories, (cats) => {
  if (categoryFilter.value && !cats.has(categoryFilter.value)) {
    categoryFilter.value = null
  }
})

watch(markerLegend, (items) => {
  if (!markerFilter.value) return
  if (!items.some((item) => item.key === markerFilter.value)) {
    markerFilter.value = null
  }
})

watch(groupMode, (mode) => {
  collapsedIds.value = new Set()
  if (mode === 'type') collapseTypeGroups()
})

watch(callerGrain, () => {
  if (groupMode.value === 'caller') collapsedIds.value = new Set()
})

const ticks = computed(() => {
  const total = timeline.value?.totalMs || 0
  if (total <= 0) return []
  const steps = total < 10 ? 2 : 4
  return Array.from({ length: steps + 1 }, (_, i) => {
    const ms = (total * i) / steps
    return {
      pct: (i / steps) * 100,
      label: formatMs(ms),
    }
  })
})

/** Interior time marks only — 0%/100% are the track edges. */
const guideTicks = computed(() =>
  ticks.value.filter((tick) => tick.pct > 0 && tick.pct < 100)
)

function setGroupMode(mode) {
  groupMode.value = mode
}

function setCallerGrain(grain) {
  callerGrain.value = grain
}

function collapseTypeGroups() {
  const ids = modeSpans.value.filter((s) => s.isTypeGroup).map((s) => s.id)
  collapsedIds.value = new Set(ids)
}

function isFastLeaf(span) {
  if (!span) return false
  if (span.isCallerGroup || span.isTypeGroup || span.isTransactionGroup) return false
  if (span.category === 'request' || span.category === 'error') return false
  if (span.label === 'TRANSACTION') return false
  if (!span.sourceKey) return false
  return (span.durationInclusiveMs ?? span.durationMs ?? 0) < FAST_MS
}

function isOutlier(span) {
  if (span.category === 'request' || span.category === 'error') return false
  if (span.isCallerGroup || span.isTypeGroup || span.isTransactionGroup) return false
  const total = timeline.value?.totalMs || 0
  const ms = span.durationExclusiveMs ?? span.durationInclusiveMs ?? span.durationMs ?? 0
  // Absolute floor always counts (ERP: 300ms by default).
  if (ms >= outlierMs.value) return true
  // % of request only if the span itself is non-trivial — otherwise a 1ms
  // query on a 5ms request looks "slow" at 20% and is noise.
  const relativeMinMs = Math.max(50, Math.round(outlierMs.value * 0.25))
  if (total > 0 && ms >= relativeMinMs && ms / total >= outlierPct.value) return true
  return false
}

function outlierTitle(kind) {
  const relMin = Math.max(50, Math.round(outlierMs.value * 0.25))
  const base = `≥${outlierMs.value} ms or (≥${settings.outlierPct}% and ≥${relMin} ms)`
  if (kind === 'view') return `Heavy view (${base})`
  if (kind === 'db') return `Slow query (${base})`
  return `Slow span (${base})`
}

function spanSourceKeys(span) {
  if (span.highlightKeys?.length) return span.highlightKeys
  return span.sourceKey ? [span.sourceKey] : []
}

function hasNPlusOne(span) {
  const keys = nPlusOneKeys.value
  if (!keys.size) return false
  return spanSourceKeys(span).some((k) => keys.has(k))
}

function spanMarkers(span) {
  if (span.category === 'request' || span.category === 'error') return []
  const markers = []
  if (hasNPlusOne(span)) {
    const count = spanSourceKeys(span).filter((k) => nPlusOneKeys.value.has(k)).length
    markers.push({
      key: 'n1',
      label: span.isCallerGroup || span.isTypeGroup || span.isTransactionGroup
        ? `N+1 · ${count}`
        : 'N+1',
      title: `Repeated SQL pattern (≥${settings.nPlusOneMin}) — possible N+1`,
      badgeClass: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 ring-1 ring-amber-500/35',
    })
  }
  if (!span.isCallerGroup && !span.isTypeGroup && !span.isTransactionGroup && isOutlier(span)) {
    if (span.category === 'view') {
      markers.push({
        key: 'heavy',
        label: 'Heavy',
        title: outlierTitle('view'),
        badgeClass: 'bg-rose-500/20 text-rose-800 dark:text-rose-300 ring-1 ring-rose-500/35',
      })
    } else if (span.category === 'db') {
      if (!hasNPlusOne(span)) {
        markers.push({
          key: 'slow',
          label: 'Slow',
          title: outlierTitle('db'),
          badgeClass: 'bg-orange-500/20 text-orange-800 dark:text-orange-300 ring-1 ring-orange-500/35',
        })
      }
    } else {
      markers.push({
        key: 'slow',
        label: 'Slow',
        title: outlierTitle('other'),
        badgeClass: 'bg-orange-500/20 text-orange-800 dark:text-orange-300 ring-1 ring-orange-500/35',
      })
    }
  }
  return markers
}

function barMarkerClass(span) {
  if (hasNPlusOne(span)) {
    return 'ring-2 ring-amber-400/90 dark:ring-amber-300/80 ring-offset-0'
  }
  if (isOutlier(span)) {
    if (span.category === 'view') {
      return 'ring-2 ring-rose-400/80 dark:ring-rose-300/70'
    }
    return 'ring-2 ring-orange-400/80 dark:ring-orange-300/70'
  }
  return ''
}

function gapStyle(gap) {
  const total = timeline.value?.totalMs || 1
  const left = Math.min(100, (gap.startMs / total) * 100)
  const width = Math.min(100 - left, Math.max((gap.durationMs / total) * 100, 0.4))
  return {
    left: left + '%',
    width: width + '%',
  }
}

function spanWallDuration(span) {
  return span.durationWallMs ?? span.durationInclusiveMs ?? span.durationMs ?? 0
}

function spanEnd(span) {
  // Nesting containment must use wall (open) time so TX/caller gaps still cover children.
  return span.startMs + spanWallDuration(span)
}

function findParent(spans, index) {
  const span = spans[index]
  const depth = span.nestDepth || 0
  if (depth <= 0) return null
  const targetDepth = depth - 1
  const end = spanEnd(span)

  for (let i = index - 1; i >= 0; i--) {
    const cand = spans[i]
    if ((cand.nestDepth || 0) !== targetDepth) continue
    if (cand.category === 'request' || cand.category === 'error') continue
    if (span.startMs >= cand.startMs - 1e-6 && end <= spanEnd(cand) + 1e-6) {
      return cand
    }
  }

  // Fallback: nearest preceding span at parent depth (TRANSACTION edge cases).
  for (let i = index - 1; i >= 0; i--) {
    const cand = spans[i]
    if ((cand.nestDepth || 0) !== targetDepth) continue
    if (cand.category === 'request' || cand.category === 'error') continue
    return cand
  }
  return null
}

function isNestVisible(span) {
  let parentId = parentById.value.get(span.id)
  while (parentId) {
    if (collapsedIds.value.has(parentId)) return false
    parentId = parentById.value.get(parentId)
  }
  return true
}

function childCount(id) {
  return childCountById.value.get(id) || 0
}

function isExpanded(id) {
  return !collapsedIds.value.has(id)
}

function toggleExpand(id, event) {
  event?.stopPropagation?.()
  const next = new Set(collapsedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  collapsedIds.value = next
}

function expandAll() {
  collapsedIds.value = new Set()
}

function collapseAll() {
  collapsedIds.value = new Set(nestParentIds.value)
}

function toggleFilter(category) {
  categoryFilter.value = categoryFilter.value === category ? null : category
}

function toggleMarkerFilter(key) {
  if (key === 'gap') return
  const next = markerFilter.value === key ? null : key
  markerFilter.value = next
  if (next) expandAll()
}

function filterClass(category) {
  if (!categoryFilter.value) return ''
  if (categoryFilter.value === category) {
    return 'bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-100 ring-1 ring-surface-300 dark:ring-surface-500'
  }
  return 'opacity-40'
}

function filterTitle(category) {
  if (categoryFilter.value === category) return 'Click to clear filter'
  return `Show only ${legend.find((item) => item.category === category)?.label || category}`
}

function markerFilterClass(item) {
  if (item.key === 'gap') return 'cursor-help opacity-90'
  if (!markerFilter.value) return ''
  if (markerFilter.value === item.key) {
    return 'bg-surface-200 dark:bg-surface-700 ring-1 ring-surface-300 dark:ring-surface-500'
  }
  return 'opacity-40'
}

function markerFilterTitle(item) {
  if (item.key === 'gap') return item.title
  if (markerFilter.value === item.key) return `${item.title} — click to clear filter`
  return `${item.title} — click to filter`
}

function spanMatchesMarker(span, key) {
  if (!span || !key) return false
  if (span.category === 'request' || span.category === 'error') return false
  if (key === 'n1') return hasNPlusOne(span)
  if (key === 'slow') {
    if (span.category !== 'db') return false
    if (hasNPlusOne(span)) return false
    return isOutlier(span)
  }
  if (key === 'heavy') {
    if (span.category !== 'view') return false
    return isOutlier(span)
  }
  return false
}

function isNavigable(span) {
  return (
    span.category === 'view' ||
    span.category === 'db' ||
    span.category === 'cache' ||
    span.category === 'error'
  )
}

function rowClass(span) {
  if (span.category === 'error') {
    return [
      'cursor-pointer bg-red-600 dark:bg-red-500 text-white',
      'hover:bg-red-700 dark:hover:bg-red-400',
      span.frames?.length ? 'rounded-t-sm' : 'rounded-sm',
    ].join(' ')
  }
  if (span.isTypeGroup) {
    return 'rounded-sm cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700/50'
  }
  if (!isNavigable(span)) return 'rounded-sm'
  return 'rounded-sm cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700/50'
}

function labelClass(span) {
  if (span.category === 'error') return 'text-white'
  if (span.category === 'request' && span.hasError) {
    return 'text-red-600 dark:text-red-400'
  }
  // Category-colored text only on Type mode group headers.
  if (span.isTypeGroup) {
    return `${categoryTextClass(span.category)} font-semibold`
  }
  if (span.isCallerGroup || isOutlier(span) || hasNPlusOne(span)) {
    return 'text-surface-800 dark:text-surface-100 font-semibold'
  }
  return 'text-surface-700 dark:text-surface-200'
}

function durationClass(span) {
  if (span.category === 'error') return 'text-white font-semibold'
  if (span.isTypeGroup) {
    return `${categoryTextClass(span.category)} font-semibold`
  }
  if (span.isCallerGroup || isOutlier(span) || hasNPlusOne(span)) {
    return 'text-surface-700 dark:text-surface-200 font-semibold'
  }
  return 'text-surface-500 dark:text-surface-400'
}

function categoryTextClass(category) {
  switch (category) {
    case 'view':
      return 'text-amber-700 dark:text-amber-400'
    case 'db':
      return 'text-sky-700 dark:text-sky-400'
    case 'cache':
      return 'text-emerald-700 dark:text-emerald-400'
    case 'error':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-surface-800 dark:text-surface-100'
  }
}

function rowTitle(span) {
  if (span.category === 'request') return requestBreakdownTitle.value
  if (span.category === 'error') {
    return `${span.label}${span.detail ? ': ' + span.detail : ''} — click to open Error`
  }
  const tip = tooltip(span)
  if (!isNavigable(span)) return tip
  const dest =
    span.category === 'view' ? 'Rendering' : span.category === 'db' ? 'Database' : 'Cache'
  return `${tip} — click to open ${dest}`
}

function onRowClick(span) {
  if (!isNavigable(span)) return
  emit('navigate', {
    category: span.category,
    highlightKeys: span.highlightKeys || (span.sourceKey ? [span.sourceKey] : []),
  })
}

function barStyle(span) {
  const total = timeline.value?.totalMs || 1
  // Bar uses wall-clock so open gaps (TX/caller/type) stay visible on the axis.
  const left = Math.min(100, (span.startMs / total) * 100)
  const wall = spanWallDuration(span)
  const width = Math.min(100 - left, Math.max((wall / total) * 100, span.category === 'error' ? 1.5 : 0.15))
  return {
    left: left + '%',
    width: width + '%',
  }
}

function isGroupParent(span) {
  return !!(span.isTypeGroup || span.isCallerGroup || span.isTransactionGroup)
}

function displayDuration(span) {
  // Group parents: work sum (not wall). Matches Database/header totals.
  if (isGroupParent(span)) {
    return span.durationExclusiveMs ?? span.durationMs
  }
  return span.durationInclusiveMs ?? span.durationMs
}

function barClass(category) {
  switch (category) {
    case 'db':
      return 'bg-sky-500/90 dark:bg-sky-400/90'
    case 'view':
      return 'bg-amber-500/90 dark:bg-amber-400/90'
    case 'cache':
      return 'bg-emerald-500/90 dark:bg-emerald-400/90'
    case 'error':
      return 'bg-red-500 dark:bg-red-400'
    default:
      return 'bg-surface-400/80 dark:bg-surface-500/80'
  }
}

function dotClass(category, span) {
  if (category === 'error') return 'bg-white'
  if (category === 'request' && span?.hasError) return 'bg-red-500'
  switch (category) {
    case 'db':
      return 'bg-sky-500'
    case 'view':
      return 'bg-amber-500'
    case 'cache':
      return 'bg-emerald-500'
    default:
      return 'bg-surface-400'
  }
}

function formatMs(ms) {
  const n = Number(ms) || 0
  if (n <= 0) return '0 ms'
  if (n < 0.1) return '<0.1 ms'
  if (n < 10) return n.toFixed(1) + ' ms'
  return Math.round(n) + ' ms'
}

function formatPct(pct) {
  if (pct < 0.1) return '<0.1%'
  if (pct < 10) return pct.toFixed(1) + '%'
  return Math.round(pct) + '%'
}

function shortenFrame(frame) {
  const normalized = String(frame || '')
  // Prefer app/... paths when present
  const appIdx = normalized.indexOf('app/')
  if (appIdx >= 0) return normalized.slice(appIdx)
  return normalized
}

function tooltip(span) {
  if (isGroupParent(span)) {
    const work = span.durationExclusiveMs ?? span.durationMs
    const wall = spanWallDuration(span)
    const parts = [span.label, formatMs(work)]
    if (Math.abs(wall - work) >= 0.05) parts.push(`open ${formatMs(wall)}`)
    parts.push(`+${formatMs(span.startMs)}`)
    if (span.detail) parts.push(span.detail)
    const markers = spanMarkers(span)
    if (markers.length) parts.push(markers.map((m) => m.label).join(', '))
    return parts.join(' · ')
  }

  const wall = span.durationInclusiveMs ?? span.durationMs
  const self = span.durationExclusiveMs
  const parts = [span.label, formatMs(wall)]
  if (
    span.category === 'view' &&
    self != null &&
    Math.abs(self - wall) >= 0.05
  ) {
    parts.push(`self ${formatMs(self)}`)
  }
  parts.push(`+${formatMs(span.startMs)}`)
  if (span.detail) parts.push(span.detail)
  const markers = spanMarkers(span)
  if (markers.length) parts.push(markers.map((m) => m.label).join(', '))
  return parts.join(' · ')
}
</script>

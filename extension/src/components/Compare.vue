<template>
  <div class="h-full min-h-0 overflow-auto p-3 space-y-4 text-sm">
    <div
      v-if="!result"
      class="flex items-center justify-center h-full min-h-[8rem]
             text-surface-500 dark:text-surface-400 text-xs"
    >
      Pick two requests with Compare (A = baseline, B = after).
    </div>

    <template v-else>
      <!-- Action mismatch warning -->
      <div
        v-if="!result.sameAction"
        class="rounded border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-[11px]
               text-amber-900 dark:text-amber-200"
      >
        Comparing different actions:
        <span class="font-semibold">{{ result.a.action }}</span>
        vs
        <span class="font-semibold">{{ result.b.action }}</span>
      </div>

      <!-- One-line summary -->
      <div
        class="rounded border border-surface-200 dark:border-surface-700
               bg-surface-50 dark:bg-surface-900/40 px-2.5 py-1.5
               text-[12px] leading-snug text-surface-800 dark:text-surface-100"
        :title="result.summary.text"
      >
        <span class="font-semibold mr-1">B − A</span>
        <span :class="deltaClass(result.totalDelta)">{{ result.summary.text }}</span>
      </div>

      <!-- Header -->
      <div class="flex flex-wrap items-start gap-3 justify-between">
        <div class="min-w-0 flex-1 space-y-1.5">
          <div class="flex flex-wrap items-center gap-2 min-w-0">
            <span
              class="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide
                     bg-surface-200 text-surface-800 dark:bg-surface-600 dark:text-surface-100"
            >A</span>
            <span class="font-semibold truncate" :title="result.a.action">{{ result.a.action }}</span>
            <span class="text-surface-500 dark:text-surface-400 tabular-nums">
              {{ result.a.status }} · {{ formatMs(result.a.duration) }}
            </span>
            <span
              v-if="result.a.isExternal"
              class="shrink-0 rounded px-1 py-px text-[9px] font-semibold uppercase
                     bg-fuchsia-500/20 text-fuchsia-800 dark:text-fuchsia-200
                     ring-1 ring-fuchsia-500/40"
            >ext</span>
          </div>
          <div class="flex flex-wrap items-center gap-2 min-w-0">
            <span
              class="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide
                     bg-primary-500/20 text-primary-800 dark:text-primary-200
                     ring-1 ring-primary-500/35"
            >B</span>
            <span class="font-semibold truncate" :title="result.b.action">{{ result.b.action }}</span>
            <span class="text-surface-500 dark:text-surface-400 tabular-nums">
              {{ result.b.status }} · {{ formatMs(result.b.duration) }}
            </span>
            <span
              v-if="result.b.isExternal"
              class="shrink-0 rounded px-1 py-px text-[9px] font-semibold uppercase
                     bg-fuchsia-500/20 text-fuchsia-800 dark:text-fuchsia-200
                     ring-1 ring-fuchsia-500/40"
            >ext</span>
          </div>
        </div>

        <div class="shrink-0 flex flex-col items-end gap-1.5">
          <div
            class="text-lg font-bold tabular-nums leading-none"
            :class="deltaClass(result.totalDelta)"
            :title="`B − A = ${formatSignedMs(result.totalDelta)} (${formatSignedPct(result.totalDeltaPct)})`"
          >
            {{ formatSignedMs(result.totalDelta) }}
            <span class="text-sm font-semibold opacity-80">
              ({{ formatSignedPct(result.totalDeltaPct) }})
            </span>
          </div>
          <div class="flex flex-wrap justify-end gap-1">
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium
                     cursor-pointer select-none transition-colors
                     text-surface-600 dark:text-surface-300
                     hover:bg-surface-100 dark:hover:bg-surface-700"
              title="Select request A and open Params"
              @click="openSide('A', 'params')"
            >
              Open A
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium
                     cursor-pointer select-none transition-colors
                     text-surface-600 dark:text-surface-300
                     hover:bg-surface-100 dark:hover:bg-surface-700"
              title="Select request B and open Params"
              @click="openSide('B', 'params')"
            >
              Open B
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium
                     cursor-pointer select-none transition-colors
                     text-surface-600 dark:text-surface-300
                     hover:bg-surface-100 dark:hover:bg-surface-700"
              title="Copy compare summary as text"
              @click="onCopyText"
            >
              <i class="pi pi-copy text-[10px]"></i>
              Copy
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium
                     cursor-pointer select-none transition-colors
                     text-surface-600 dark:text-surface-300
                     hover:bg-surface-100 dark:hover:bg-surface-700"
              title="Download compare JSON"
              @click="onExportJson"
            >
              <i class="pi pi-download text-[10px]"></i>
              Export
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium
                     cursor-pointer select-none transition-colors
                     text-surface-600 dark:text-surface-300
                     hover:bg-surface-100 dark:hover:bg-surface-700"
              title="Swap A and B"
              @click="store.swapCompare()"
            >
              <i class="pi pi-arrow-right-arrow-left text-[10px]"></i>
              Swap
            </button>
            <button
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
          </div>
          <div
            v-if="ioMessage"
            class="text-[10px]"
            :class="ioError ? 'text-red-600 dark:text-red-400' : 'text-surface-500 dark:text-surface-400'"
          >
            {{ ioMessage }}
          </div>
        </div>
      </div>

      <!-- Quick open tabs -->
      <div class="flex flex-wrap gap-1 text-[10px]">
        <span class="text-surface-500 dark:text-surface-400 self-center mr-1">Jump:</span>
        <button
          v-for="jump in jumpTabs"
          :key="jump.tab"
          type="button"
          class="rounded px-1.5 py-0.5 font-medium cursor-pointer
                 text-surface-600 dark:text-surface-300
                 hover:bg-surface-100 dark:hover:bg-surface-700"
          :title="`Open A → ${jump.label}`"
          @click="openSide('A', jump.tab)"
        >A {{ jump.label }}</button>
        <button
          v-for="jump in jumpTabs"
          :key="'b-' + jump.tab"
          type="button"
          class="rounded px-1.5 py-0.5 font-medium cursor-pointer
                 text-primary-700 dark:text-primary-300
                 hover:bg-primary-500/10"
          :title="`Open B → ${jump.label}`"
          @click="openSide('B', jump.tab)"
        >B {{ jump.label }}</button>
      </div>

      <!-- Stacked bars -->
      <div class="space-y-2">
        <div
          v-for="row in barRows"
          :key="row.slot"
          class="flex items-center gap-2"
        >
          <span
            class="w-4 shrink-0 text-[10px] font-bold text-center"
            :class="row.slot === 'A'
              ? 'text-surface-600 dark:text-surface-300'
              : 'text-primary-700 dark:text-primary-300'"
          >{{ row.slot }}</span>
          <div
            class="flex-1 min-w-0 h-4 rounded-sm overflow-hidden flex
                   bg-surface-200/80 dark:bg-surface-700/80"
            :title="row.title"
          >
            <div
              v-for="seg in row.segments"
              :key="seg.key"
              class="h-full"
              :class="seg.barClass"
              :style="{ width: seg.pct + '%' }"
              :title="`${seg.label}: ${formatMs(seg.ms)}`"
            />
          </div>
          <span class="w-16 shrink-0 text-right tabular-nums text-[11px] text-surface-600 dark:text-surface-300">
            {{ formatMs(row.total) }}
          </span>
        </div>
        <div class="flex flex-wrap gap-3 text-[10px] text-surface-500 dark:text-surface-400 pl-6">
          <span class="inline-flex items-center gap-1">
            <span class="w-2 h-2 rounded-sm bg-amber-500" /> View
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="w-2 h-2 rounded-sm bg-sky-500" /> DB
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="w-2 h-2 rounded-sm bg-emerald-500" /> Cache
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="w-2 h-2 rounded-sm bg-surface-400" /> Other
          </span>
        </div>
      </div>

      <!-- Waterfall sync -->
      <div class="space-y-2">
        <h3 class="text-xs font-bold uppercase tracking-wide text-surface-600 dark:text-surface-300">
          Waterfall sync
          <span class="font-normal normal-case tracking-normal text-surface-400">
            (same scale · top-level spans)
          </span>
        </h3>
        <div class="space-y-1.5">
          <div
            v-for="lane in waterfallLanes"
            :key="lane.slot"
            class="flex items-center gap-2"
          >
            <span
              class="w-4 shrink-0 text-[10px] font-bold text-center"
              :class="lane.slot === 'A'
                ? 'text-surface-600 dark:text-surface-300'
                : 'text-primary-700 dark:text-primary-300'"
            >{{ lane.slot }}</span>
            <div
              class="relative flex-1 min-w-0 h-7 rounded-sm overflow-hidden
                     bg-surface-200/80 dark:bg-surface-700/80
                     ring-1 ring-surface-200 dark:ring-surface-600"
            >
              <div
                v-for="span in lane.spans"
                :key="lane.slot + span.id"
                class="absolute top-1 bottom-1 rounded-[2px] opacity-90"
                :class="span.barClass"
                :style="{ left: span.leftPct + '%', width: span.widthPct + '%' }"
                :title="`${span.label} · ${formatMs(span.durationMs)} @ ${formatMs(span.startMs)}`"
              />
              <div
                v-if="!lane.spans.length"
                class="absolute inset-0 flex items-center justify-center text-[10px]
                       text-surface-400 dark:text-surface-500"
              >
                no spans
              </div>
            </div>
          </div>
          <div class="flex justify-between pl-6 pr-0 text-[10px] tabular-nums text-surface-400">
            <span>0</span>
            <span>{{ formatMs(result.scaleMs / 2) }}</span>
            <span>{{ formatMs(result.scaleMs) }}</span>
          </div>
        </div>
      </div>

      <!-- Metrics table -->
      <div class="overflow-x-auto rounded border border-surface-200 dark:border-surface-700">
        <table class="w-full text-left text-[12px] border-collapse">
          <thead>
            <tr class="bg-surface-50 dark:bg-surface-900/60 text-surface-600 dark:text-surface-300">
              <th class="px-2 py-1.5 font-semibold">Metric</th>
              <th class="px-2 py-1.5 font-semibold text-right">A</th>
              <th class="px-2 py-1.5 font-semibold text-right">B</th>
              <th class="px-2 py-1.5 font-semibold text-right">Δ</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in result.metrics"
              :key="row.key"
              class="border-t border-surface-200 dark:border-surface-700"
            >
              <td class="px-2 py-1">{{ row.label }}</td>
              <td class="px-2 py-1 text-right tabular-nums">{{ formatMetric(row.a, row.unit) }}</td>
              <td class="px-2 py-1 text-right tabular-nums">{{ formatMetric(row.b, row.unit) }}</td>
              <td
                class="px-2 py-1 text-right tabular-nums font-medium"
                :class="deltaClass(row.delta)"
              >
                {{ formatMetricDelta(row) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Params diff -->
      <CompareSection
        v-model="sectionOpen.params"
        title="Params"
        :count-label="`${displayedParams.length}/${visibleParamsBase.length}`"
        data-compare-params
      >
        <template #actions>
          <label
            class="inline-flex items-center gap-1 text-[10px] text-surface-600 dark:text-surface-300
                   cursor-pointer select-none"
          >
            <input v-model="hideFrameworkParams" type="checkbox" class="accent-primary-500" />
            Hide framework
          </label>
          <div class="inline-flex flex-wrap gap-0.5 rounded border border-surface-200 dark:border-surface-700 p-0.5">
            <button
              v-for="opt in paramFilters"
              :key="opt.key"
              type="button"
              class="rounded px-1.5 py-0.5 text-[10px] font-medium cursor-pointer select-none transition-colors"
              :class="paramFilter === opt.key
                ? 'bg-primary-500/15 text-primary-800 dark:text-primary-200'
                : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'"
              @click="paramFilter = opt.key"
            >
              {{ opt.label }}
            </button>
          </div>
        </template>

        <div
          v-if="!visibleParamsBase.length"
          class="text-xs text-surface-500 dark:text-surface-400 py-3 text-center"
        >
          No params on either request.
        </div>
        <div
          v-else
          class="rounded border border-surface-200 dark:border-surface-700 overflow-hidden"
        >
          <DetailSearch
            v-model="paramsSearch"
            placeholder="Filter params…"
            :count="paramsSearch.trim() ? displayedParams.length : null"
          />
          <div
            v-if="!displayedParams.length"
            class="text-xs text-surface-500 dark:text-surface-400 py-3 text-center"
          >
            No params match this filter.
          </div>
          <DetailsTable
            v-else
            :value="paramTableRows"
            dataKey="_key"
            state-key="rp-compare-params-v2"
            sortMode="single"
            removableSort
            rowHover
            class="!h-auto cursor-pointer"
            @row-click="(e) => openDiffRow('params', e?.data || e)"
          >
            <Column sortable field="_sideRank" header="Side" :style="paramSideCol">
              <template #body="slotProps">
                <span
                  class="inline-block rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide"
                  :class="paramSideBadgeClass(slotProps.data)"
                >{{ paramSideLabel(slotProps.data) }}</span>
              </template>
            </Column>
            <Column sortable field="name" header="Name" :style="paramNameCol">
              <template #body="slotProps">
                <span class="font-semibold break-all">
                  {{ slotProps.data.name }}
                  <span
                    v-if="slotProps.data.isFramework"
                    class="ml-1 text-[9px] font-normal text-surface-400 whitespace-nowrap"
                  >fw</span>
                </span>
              </template>
            </Column>
            <Column field="valueA" header="A" :style="paramValueCol">
              <template #body="slotProps">
                <pre
                  class="m-0 max-h-40 overflow-auto whitespace-pre-wrap break-words
                         font-mono text-[10px] leading-snug"
                  :title="paramTitle(slotProps.data.rawA, slotProps.data.valueA)"
                  v-html="prettyParam(slotProps.data.rawA, slotProps.data.valueA)"
                ></pre>
              </template>
            </Column>
            <Column field="valueB" header="B" :style="paramValueCol">
              <template #body="slotProps">
                <pre
                  class="m-0 max-h-40 overflow-auto whitespace-pre-wrap break-words
                         font-mono text-[10px] leading-snug"
                  :class="slotProps.data.side === 'changed' ? 'ring-1 ring-inset ring-amber-500/25 rounded-sm px-0.5' : ''"
                  :title="paramTitle(slotProps.data.rawB, slotProps.data.valueB)"
                  v-html="prettyParam(slotProps.data.rawB, slotProps.data.valueB)"
                ></pre>
              </template>
            </Column>
          </DetailsTable>
        </div>
      </CompareSection>

      <!-- SQL diff -->
      <CompareSection
        v-model="sectionOpen.sql"
        title="SQL patterns"
        :count-label="`${displayedSql.length}/${result.sqlDiff.length}`"
      >
        <template #actions>
          <div class="inline-flex flex-wrap gap-0.5 rounded border border-surface-200 dark:border-surface-700 p-0.5">
            <button
              v-for="opt in sqlFilters"
              :key="opt.key"
              type="button"
              class="rounded px-1.5 py-0.5 text-[10px] font-medium cursor-pointer select-none transition-colors"
              :class="sqlFilter === opt.key
                ? 'bg-primary-500/15 text-primary-800 dark:text-primary-200'
                : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'"
              @click="sqlFilter = opt.key"
            >
              {{ opt.label }}
            </button>
          </div>
        </template>

        <div
          v-if="!result.sqlDiff.length"
          class="text-xs text-surface-500 dark:text-surface-400 py-4 text-center"
        >
          No SQL patterns on either request.
        </div>
        <div
          v-else
          class="rounded border border-surface-200 dark:border-surface-700 overflow-hidden"
        >
          <DetailSearch
            v-model="sqlSearch"
            placeholder="Filter SQL patterns…"
            :count="sqlSearch.trim() ? displayedSql.length : null"
          />
          <div
            v-if="!displayedSql.length"
            class="text-xs text-surface-500 dark:text-surface-400 py-4 text-center"
          >
            No SQL patterns match this filter.
          </div>
          <CompareTimedDiffTable
            v-else
            :value="sqlTableRows"
            :framed="false"
            state-key="rp-compare-sql-v2"
            item-header="Pattern"
            item-field="pattern"
            title="Click a row to open it in Database (B when both sides)"
            @row-click="(row) => openDiffRow('sql', row)"
          >
            <template #side="{ data }">
              <div class="inline-flex items-center gap-1.5 flex-nowrap">
                <span
                  class="shrink-0 rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide"
                  :class="sideBadgeClass(data)"
                >{{ sideLabel(data) }}</span>
                <span
                  v-if="data.isNPlusOne"
                  class="shrink-0 rounded px-1 py-px text-[9px] font-semibold uppercase
                         bg-amber-500/20 text-amber-800 dark:text-amber-300
                         ring-1 ring-amber-500/35"
                >N+1</span>
                <span
                  v-if="data.nearMatch && data.side !== 'near'"
                  class="shrink-0 rounded px-1 py-px text-[9px] font-semibold
                         bg-cyan-500/15 text-cyan-800 dark:text-cyan-200
                         ring-1 ring-cyan-500/30"
                  :title="nearMatchTitle(data)"
                >≈</span>
                <span
                  v-if="data.likelyFilterDriven"
                  class="shrink-0 rounded px-1 py-px text-[9px] font-semibold uppercase
                         bg-violet-500/15 text-violet-800 dark:text-violet-200
                         ring-1 ring-violet-500/30"
                  :title="filterHintTitle(data)"
                >F?</span>
              </div>
            </template>
            <template #item="{ data }">
              <div class="min-w-0 w-full space-y-1" :title="data.sample || data.pattern">
                <div class="flex items-center gap-1.5 min-w-0">
                  <div
                    v-if="data.type"
                    class="min-w-0 flex-1 truncate text-[10px] font-medium text-surface-500 dark:text-surface-400"
                  >{{ data.type }}</div>
                  <div v-else class="flex-1 min-w-0" />
                  <div
                    class="inline-flex items-center gap-1.5 shrink-0"
                    @click.stop
                  >
                    <CopyButton
                      compact
                      label="Copy"
                      title="Copy SQL"
                      :get-text="() => data.sample || data.pattern || ''"
                    />
                    <button
                      type="button"
                      class="inline-flex items-center gap-0.5 rounded px-1 py-px text-[9px] leading-none font-medium
                             cursor-pointer select-none transition-colors
                             text-surface-600 dark:text-surface-300
                             bg-surface-100 hover:bg-surface-200
                             dark:bg-surface-700 dark:hover:bg-surface-600
                             ring-1 ring-surface-200 dark:ring-surface-600"
                      title="Expand SQL"
                      @click="openSqlDetail(data)"
                    >
                      <i class="pi pi-window-maximize text-[9px]" aria-hidden="true"></i>
                      Expand
                    </button>
                  </div>
                </div>
                <pre
                  class="hljs block w-full min-w-0 max-w-full m-0 bg-transparent
                         font-mono text-[10px] leading-snug"
                  :class="settings.compareCompactSql
                    ? 'whitespace-nowrap overflow-hidden text-ellipsis'
                    : 'whitespace-pre-wrap break-normal line-clamp-4 overflow-hidden'"
                  v-html="highlightSql(data.sample || data.pattern)"
                ></pre>
                <div
                  v-if="data.sqlClauseDiff"
                  class="text-[10px] leading-snug font-mono"
                  :title="nearMatchTitle(data)"
                >
                  <span class="text-cyan-700 dark:text-cyan-300 font-semibold mr-1">
                    {{ data.sqlClauseDiff.label }}
                  </span>
                  <span
                    v-if="data.sqlClauseDiff.kind === 'added'"
                    class="text-emerald-700 dark:text-emerald-400 break-normal"
                  >{{ truncateSqlPreview(data.sqlClauseDiff.text) }}</span>
                  <span
                    v-else-if="data.sqlClauseDiff.kind === 'removed'"
                    class="text-red-600 dark:text-red-400 break-normal"
                  >{{ truncateSqlPreview(data.sqlClauseDiff.text) }}</span>
                  <span
                    v-else
                    class="break-normal text-surface-700 dark:text-surface-200"
                  >
                    <span class="text-red-600 dark:text-red-400">{{ truncateSqlPreview(data.sqlClauseDiff.textA, 48) }}</span>
                    <span class="mx-1 text-surface-400">→</span>
                    <span class="text-emerald-700 dark:text-emerald-400">{{ truncateSqlPreview(data.sqlClauseDiff.textB, 48) }}</span>
                  </span>
                </div>
                <div
                  v-if="data.nearMatch && (data.sampleB || data.nearMatchPartnerSample)"
                  class="text-[10px] leading-snug font-mono text-surface-500 dark:text-surface-400 truncate"
                  :title="data.sampleB || data.nearMatchPartnerSample"
                >
                  <span class="font-semibold text-cyan-700 dark:text-cyan-300 mr-1">B</span>
                  {{ data.sampleB || data.nearMatchPartnerSample }}
                </div>
                <div
                  v-if="data.likelyFilterDriven && relatedParamNames(data).length"
                  class="text-[10px] leading-snug text-violet-700 dark:text-violet-300"
                  :title="filterHintTitle(data)"
                >
                  <span class="font-semibold mr-1">F?</span>
                  <span class="font-mono break-normal">{{ relatedParamNames(data).join(', ') }}</span>
                </div>
              </div>
            </template>
          </CompareTimedDiffTable>
        </div>
      </CompareSection>

      <!-- Cache diff -->
      <CompareSection
        v-model="sectionOpen.cache"
        title="Cache keys"
        :count-label="`${displayedCache.length}/${result.cacheDiff.length}`"
      >
        <template #actions>
          <div class="inline-flex flex-wrap gap-0.5 rounded border border-surface-200 dark:border-surface-700 p-0.5">
            <button
              v-for="opt in cacheFilters"
              :key="opt.key"
              type="button"
              class="rounded px-1.5 py-0.5 text-[10px] font-medium cursor-pointer select-none transition-colors"
              :class="cacheFilter === opt.key
                ? 'bg-primary-500/15 text-primary-800 dark:text-primary-200'
                : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'"
              @click="cacheFilter = opt.key"
            >
              {{ opt.label }}
            </button>
          </div>
        </template>

        <div
          v-if="!result.cacheDiff.length"
          class="text-xs text-surface-500 dark:text-surface-400 py-3 text-center"
        >
          No cache calls on either request.
        </div>
        <div
          v-else
          class="rounded border border-surface-200 dark:border-surface-700 overflow-hidden"
        >
          <DetailSearch
            v-model="cacheSearch"
            placeholder="Filter cache keys…"
            :count="cacheSearch.trim() ? displayedCache.length : null"
          />
          <div
            v-if="!displayedCache.length"
            class="text-xs text-surface-500 dark:text-surface-400 py-3 text-center"
          >
            No rows match this filter.
          </div>
          <CompareTimedDiffTable
            v-else
            :value="cacheTableRows"
            :framed="false"
            state-key="rp-compare-cache-v2"
            item-header="Key"
            item-field="key"
            show-hits
            title="Click a row to open it in Cache"
            @row-click="(row) => openDiffRow('cache', row)"
          >
            <template #side="{ data }">
              <div class="inline-flex items-center gap-1.5 flex-nowrap">
                <span
                  class="shrink-0 rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide"
                  :class="sideBadgeClass(data)"
                >{{ sideLabel(data) }}</span>
                <span
                  v-if="data.hitChanged"
                  class="shrink-0 rounded px-1 py-px text-[9px] font-semibold uppercase
                         bg-emerald-500/15 text-emerald-800 dark:text-emerald-200
                         ring-1 ring-emerald-500/30"
                >hitΔ</span>
              </div>
            </template>
            <template #item="{ data }">
              <div class="min-w-0 space-y-0.5" :title="data.key">
                <div
                  v-if="data.kind || data.typeSummary"
                  class="text-[10px] font-medium text-surface-500 dark:text-surface-400"
                >{{ data.kind || data.typeSummary }}</div>
                <code
                  class="block min-w-0 whitespace-pre-wrap break-all
                         font-mono text-[10px] leading-snug
                         text-surface-800 dark:text-surface-200"
                >{{ data.key }}</code>
              </div>
            </template>
            <template #row-actions="{ data }">
              <CopyButton
                compact
                label="Copy"
                title="Copy cache key"
                :get-text="() => data.key || ''"
              />
            </template>
          </CompareTimedDiffTable>
        </div>
      </CompareSection>

      <!-- Views diff -->
      <CompareSection
        v-model="sectionOpen.views"
        title="Views / partials"
        :count-label="`${displayedViews.length}/${result.viewDiff.length}`"
      >
        <template #actions>
          <div class="inline-flex flex-wrap gap-0.5 rounded border border-surface-200 dark:border-surface-700 p-0.5">
            <button
              v-for="opt in timedFilters"
              :key="opt.key"
              type="button"
              class="rounded px-1.5 py-0.5 text-[10px] font-medium cursor-pointer select-none transition-colors"
              :class="viewFilter === opt.key
                ? 'bg-primary-500/15 text-primary-800 dark:text-primary-200'
                : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'"
              @click="viewFilter = opt.key"
            >
              {{ opt.label }}
            </button>
          </div>
        </template>

        <div
          v-if="!result.viewDiff.length"
          class="text-xs text-surface-500 dark:text-surface-400 py-3 text-center"
        >
          No views on either request.
        </div>
        <div
          v-else
          class="rounded border border-surface-200 dark:border-surface-700 overflow-hidden"
        >
          <DetailSearch
            v-model="viewSearch"
            placeholder="Filter templates…"
            :count="viewSearch.trim() ? displayedViews.length : null"
          />
          <div
            v-if="!displayedViews.length"
            class="text-xs text-surface-500 dark:text-surface-400 py-3 text-center"
          >
            No rows match this filter.
          </div>
          <CompareTimedDiffTable
            v-else
            :value="viewTableRows"
            :framed="false"
            state-key="rp-compare-views-v2"
            item-header="Template"
            item-field="path"
            title="Click a row to open it in Rendering"
            @row-click="(row) => openDiffRow('view', row)"
          >
            <template #item="{ data }">
              <div class="min-w-0 space-y-0.5" :title="data.path">
                <div
                  v-if="data.kind || data.typeSummary"
                  class="text-[10px] font-medium text-surface-500 dark:text-surface-400"
                >{{ data.kind || data.typeSummary }}</div>
                <div class="min-w-0 break-all leading-snug">
                  <FilepathLink :filepath="data.path" :truncate="false" />
                </div>
              </div>
            </template>
            <template #row-actions="{ data }">
              <CopyButton
                compact
                label="Copy"
                title="Copy template path"
                :get-text="() => data.path || ''"
              />
            </template>
          </CompareTimedDiffTable>
        </div>
      </CompareSection>

      <!-- Exception diff -->
      <CompareSection
        v-model="sectionOpen.exceptions"
        title="Exceptions"
        tone="danger"
        :count-label="`${displayedExceptions.length}/${result.exceptionDiff.length}`"
      >
        <template #actions>
          <div
            class="inline-flex flex-wrap gap-0.5 rounded border p-0.5
                   border-red-500/35 dark:border-red-500/40"
          >
            <button
              v-for="opt in countFilters"
              :key="opt.key"
              type="button"
              class="rounded px-1.5 py-0.5 text-[10px] font-medium cursor-pointer select-none transition-colors"
              :class="exceptionFilter === opt.key
                ? 'bg-red-500/15 text-red-800 dark:text-red-200'
                : 'text-red-700 dark:text-red-300 hover:bg-red-500/10'"
              @click="exceptionFilter = opt.key"
            >
              {{ opt.label }}
            </button>
          </div>
        </template>

        <div
          v-if="!result.exceptionDiff.length"
          class="text-xs text-red-600/70 dark:text-red-400/70 py-3 text-center"
        >
          No exceptions on either request.
        </div>
        <div
          v-else
          class="rounded border overflow-hidden
                 border-red-500/35 dark:border-red-500/40 bg-red-600/5 dark:bg-red-500/10"
        >
          <DetailSearch
            v-model="exceptionSearch"
            placeholder="Filter exceptions…"
            :count="exceptionSearch.trim() ? displayedExceptions.length : null"
          />
          <div
            v-if="!displayedExceptions.length"
            class="text-xs text-red-600/70 dark:text-red-400/70 py-3 text-center"
          >
            No rows match this filter.
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr class="bg-red-600 dark:bg-red-500 text-white">
                  <th class="px-2 py-1.5 font-semibold w-14">Side</th>
                  <th class="px-2 py-1.5 font-semibold">Message</th>
                  <th class="px-2 py-1.5 font-semibold text-right whitespace-nowrap">Count</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, idx) in displayedExceptions"
                  :key="'ex-' + row.label + idx"
                  class="align-top cursor-pointer border-t border-red-500/20 dark:border-red-400/20
                         hover:bg-red-500/10"
                  title="Click to open in Error"
                  @click="openDiffRow('exception', row)"
                >
                  <td class="px-2 py-1.5">
                    <span
                      class="inline-block rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide"
                      :class="exceptionSideBadgeClass(row)"
                    >{{ sideLabel(row) }}</span>
                  </td>
                  <td class="px-2 py-1.5 min-w-0">
                    <code
                      class="block font-mono text-[10px] leading-snug whitespace-pre-wrap break-words
                             text-red-800 dark:text-red-200"
                      :title="stripAnsi(row.sample || row.label || '')"
                      v-html="ansiToHtml(row.sample || row.label || '')"
                    ></code>
                  </td>
                  <td class="px-2 py-1.5 text-right tabular-nums whitespace-nowrap text-red-800 dark:text-red-200">
                    <span>{{ row.countA }} → {{ row.countB }}</span>
                    <div
                      class="text-[10px] font-medium"
                      :class="row.deltaCount > 0
                        ? 'text-red-700 dark:text-red-300'
                        : row.deltaCount < 0
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-red-500/70 dark:text-red-400/60'"
                    >{{ formatSignedCount(row.deltaCount) }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CompareSection>
    </template>

    <Dialog
      v-model:visible="sqlDetailVisible"
      modal
      :style="{ width: 'min(52rem, 96vw)' }"
      :breakpoints="{ '640px': '98vw' }"
      :pt="sqlDialogPt"
    >
      <template #header>
        <div v-if="selectedSqlRow" class="flex-1 min-w-0 flex flex-wrap items-start gap-x-3 gap-y-2 pr-2">
          <div class="min-w-0">
            <div class="text-[10px] font-semibold uppercase tracking-[0.08em] text-sky-700 dark:text-sky-400 mb-0.5">
              Compare SQL
            </div>
            <div class="text-lg font-semibold leading-tight text-surface-900 dark:text-surface-50 truncate">
              {{ selectedSqlRow.type || 'SQL pattern' }}
            </div>
          </div>
          <span
            class="shrink-0 mt-0.5 inline-flex items-center rounded-md px-2 py-1 text-sm font-semibold tabular-nums
                   ring-1 ring-inset"
            :class="deltaClass(selectedSqlRow.deltaTime)"
          >
            {{ formatSignedMs(selectedSqlRow.deltaTime) }}
          </span>
        </div>
        <span v-else class="flex-1">SQL</span>
      </template>

      <div v-if="selectedSqlRow" class="space-y-3 max-h-[72vh] overflow-auto">
        <div class="flex flex-wrap items-center gap-2 text-[11px] tabular-nums text-surface-600 dark:text-surface-300">
          <span
            class="rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide"
            :class="sideBadgeClass(selectedSqlRow)"
          >{{ sideLabel(selectedSqlRow) }}</span>
          <span
            v-if="selectedSqlRow.nearMatch"
            class="rounded px-1 py-px text-[9px] font-semibold
                   bg-cyan-500/15 text-cyan-800 dark:text-cyan-200
                   ring-1 ring-cyan-500/30"
            :title="nearMatchTitle(selectedSqlRow)"
          >≈ SQL</span>
          <span
            v-if="selectedSqlRow.likelyFilterDriven"
            class="rounded px-1 py-px text-[9px] font-semibold uppercase
                   bg-violet-500/15 text-violet-800 dark:text-violet-200
                   ring-1 ring-violet-500/30"
            :title="filterHintTitle(selectedSqlRow)"
          >F?</span>
          <span>Count {{ selectedSqlRow.countA }} → {{ selectedSqlRow.countB }}</span>
          <span>·</span>
          <span>{{ formatMs(selectedSqlRow.timeA) }} → {{ formatMs(selectedSqlRow.timeB) }}</span>
        </div>

        <section
          v-if="selectedSqlRow.likelyFilterDriven && relatedParamRows(selectedSqlRow).length"
          class="min-w-0 rounded-md border border-violet-500/25 dark:border-violet-400/20 overflow-hidden"
        >
          <div class="px-3 py-2 border-b border-violet-500/20 dark:border-violet-400/15
                      bg-violet-500/5 dark:bg-violet-400/5">
            <h3 class="text-[11px] font-semibold uppercase tracking-[0.1em] text-violet-700 dark:text-violet-300 m-0">
              Possible filter params
            </h3>
          </div>
          <div class="space-y-3 px-3 py-2.5">
            <div
              v-for="param in relatedParamRows(selectedSqlRow)"
              :key="param.name"
              class="min-w-0"
            >
              <div class="flex flex-wrap items-center gap-1.5 mb-1.5">
                <span
                  class="rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide"
                  :class="paramSideBadgeClass(param)"
                >{{ paramSideLabel(param) }}</span>
                <span class="font-semibold text-[12px] text-surface-900 dark:text-surface-50 break-all min-w-0">
                  {{ param.name }}
                </span>
                <button
                  type="button"
                  class="ml-auto shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium cursor-pointer
                         text-violet-700 dark:text-violet-300
                         bg-violet-500/10 hover:bg-violet-500/20
                         ring-1 ring-violet-500/25 dark:ring-violet-400/20"
                  title="Show this param in Compare → Params"
                  @click="jumpToCompareParam(param.name)"
                >
                  View in Params
                </button>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] font-mono leading-snug">
                <div class="min-w-0">
                  <div class="text-[10px] font-semibold uppercase tracking-wide text-surface-500 mb-0.5">A</div>
                  <pre
                    class="m-0 max-h-32 overflow-auto whitespace-pre-wrap break-normal"
                    :title="paramTitle(param.rawA, param.valueA)"
                    v-html="prettyParam(param.rawA, param.valueA)"
                  ></pre>
                </div>
                <div class="min-w-0">
                  <div class="text-[10px] font-semibold uppercase tracking-wide text-surface-500 mb-0.5">B</div>
                  <pre
                    class="m-0 max-h-32 overflow-auto whitespace-pre-wrap break-normal"
                    :class="param.side === 'changed' ? 'rounded-sm px-0.5 bg-amber-500/10' : ''"
                    :title="paramTitle(param.rawB, param.valueB)"
                    v-html="prettyParam(param.rawB, param.valueB)"
                  ></pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          v-if="selectedSqlRow.sqlClauseDiff"
          class="min-w-0 rounded-md border border-cyan-500/25 dark:border-cyan-400/20 overflow-hidden
                 border-l-[3px] border-l-cyan-500 dark:border-l-cyan-400"
        >
          <div class="px-3 py-2 border-b border-cyan-500/15 dark:border-cyan-400/10
                      bg-cyan-500/5 dark:bg-cyan-400/5">
            <h3 class="text-[11px] font-semibold uppercase tracking-[0.1em] text-cyan-700 dark:text-cyan-400 m-0">
              SQL difference
              <span class="ml-1.5 font-normal normal-case tracking-normal text-cyan-600/80 dark:text-cyan-300/80">
                {{ selectedSqlRow.sqlClauseDiff.label }}
              </span>
            </h3>
          </div>
          <div class="font-mono text-[12px] leading-snug px-3 py-2.5">
            <div
              v-if="selectedSqlRow.sqlClauseDiff.kind === 'added'"
              class="text-emerald-700 dark:text-emerald-400 break-words whitespace-pre-wrap"
            >{{ selectedSqlRow.sqlClauseDiff.text }}</div>
            <div
              v-else-if="selectedSqlRow.sqlClauseDiff.kind === 'removed'"
              class="text-red-600 dark:text-red-400 break-words whitespace-pre-wrap"
            >{{ selectedSqlRow.sqlClauseDiff.text }}</div>
            <div
              v-else
              class="break-words whitespace-pre-wrap space-y-1"
            >
              <div>
                <span class="text-[10px] font-semibold text-surface-500 mr-1">A</span>
                <span class="text-red-600 dark:text-red-400">{{ selectedSqlRow.sqlClauseDiff.textA }}</span>
              </div>
              <div>
                <span class="text-[10px] font-semibold text-surface-500 mr-1">B</span>
                <span class="text-emerald-700 dark:text-emerald-400">{{ selectedSqlRow.sqlClauseDiff.textB }}</span>
              </div>
            </div>
          </div>
        </section>

        <div
          class="grid grid-cols-1 gap-3 min-w-0"
          :class="selectedSqlRow.nearMatch ? 'lg:grid-cols-2' : ''"
        >
          <section
            class="min-w-0 rounded-md border border-surface-200 dark:border-surface-600 overflow-hidden
                   border-l-[3px] border-l-sky-500 dark:border-l-sky-400"
          >
            <div class="flex items-center justify-between gap-2 px-3 py-2
                        border-b border-surface-200 dark:border-surface-600
                        bg-surface-100/60 dark:bg-surface-800/60">
              <h3 class="text-[11px] font-semibold uppercase tracking-[0.1em] text-sky-700 dark:text-sky-400 m-0">
                SQL
                <span
                  v-if="selectedSqlRow.nearMatch"
                  class="ml-1 font-normal normal-case tracking-normal text-surface-400"
                >A</span>
              </h3>
              <CopyButton
                label="Copy SQL"
                title="Copy SQL A to clipboard"
                :get-text="() => selectedSqlRow?.sampleA || selectedSqlRow?.sample || selectedSqlRow?.pattern || ''"
              />
            </div>
            <pre
              class="hljs font-mono text-[13px] leading-[1.55] whitespace-pre-wrap break-normal m-0 px-3.5 py-3
                     bg-surface-50 dark:bg-surface-900 overflow-x-auto"
              v-html="highlightSql(selectedSqlRow.sampleA || selectedSqlRow.sample || selectedSqlRow.pattern)"
            ></pre>
          </section>

          <section
            v-if="selectedSqlRow.nearMatch && (selectedSqlRow.sampleB || selectedSqlRow.nearMatchPartnerSample || selectedSqlRow.nearMatchPartnerPattern)"
            class="min-w-0 rounded-md border border-surface-200 dark:border-surface-600 overflow-hidden
                   border-l-[3px] border-l-cyan-500 dark:border-l-cyan-400"
          >
            <div class="flex items-center justify-between gap-2 px-3 py-2
                        border-b border-surface-200 dark:border-surface-600
                        bg-surface-100/60 dark:bg-surface-800/60">
              <h3 class="text-[11px] font-semibold uppercase tracking-[0.1em] text-cyan-700 dark:text-cyan-400 m-0">
                SQL
                <span class="ml-1 font-normal normal-case tracking-normal text-surface-400">B</span>
              </h3>
              <CopyButton
                label="Copy SQL"
                title="Copy SQL B to clipboard"
                :get-text="() => selectedSqlRow?.sampleB || selectedSqlRow?.nearMatchPartnerSample || selectedSqlRow?.nearMatchPartnerPattern || ''"
              />
            </div>
            <pre
              class="hljs font-mono text-[13px] leading-[1.55] whitespace-pre-wrap break-normal m-0 px-3.5 py-3
                     bg-surface-50 dark:bg-surface-900 overflow-x-auto"
              v-html="highlightSql(selectedSqlRow.sampleB || selectedSqlRow.nearMatchPartnerSample || selectedSqlRow.nearMatchPartnerPattern)"
            ></pre>
          </section>
        </div>

        <div
          v-if="hasBinds(selectedSqlRow.bindsA) || hasBinds(selectedSqlRow.bindsB)"
          class="grid grid-cols-1 gap-3 min-w-0"
          :class="hasBinds(selectedSqlRow.bindsA) && hasBinds(selectedSqlRow.bindsB) ? 'lg:grid-cols-2' : ''"
        >
          <div
            v-if="hasBinds(selectedSqlRow.bindsA)"
            class="min-w-0 rounded-md border border-surface-200 dark:border-surface-600 overflow-hidden
                   border-l-[3px] border-l-surface-400 dark:border-l-surface-500"
          >
            <div class="flex items-center justify-between gap-2 px-3 py-2
                        border-b border-surface-200 dark:border-surface-600
                        bg-surface-100/60 dark:bg-surface-800/60">
              <h3 class="text-[11px] font-semibold uppercase tracking-[0.1em] text-surface-500 dark:text-surface-400 m-0">
                Binds A
                <span class="ml-1 font-normal normal-case tracking-normal tabular-nums text-surface-400">
                  {{ bindsCount(selectedSqlRow.bindsA) }}
                </span>
              </h3>
              <CopyButton
                label="Copy binds"
                title="Copy A binds to clipboard"
                :get-text="() => formatBindsPlain(selectedSqlRow.bindsA)"
              />
            </div>
            <pre
              class="font-mono text-[12px] leading-[1.5] whitespace-pre-wrap break-normal m-0 px-3 py-2.5
                     bg-surface-50 dark:bg-surface-900
                     text-surface-800 dark:text-surface-100 overflow-x-auto"
              v-html="formatBindsHtml(selectedSqlRow.bindsA)"
            ></pre>
          </div>
          <div
            v-if="hasBinds(selectedSqlRow.bindsB)"
            class="min-w-0 rounded-md border border-surface-200 dark:border-surface-600 overflow-hidden
                   border-l-[3px]"
            :class="bindsChanged(selectedSqlRow)
              ? 'border-l-amber-500 dark:border-l-amber-400'
              : 'border-l-surface-400 dark:border-l-surface-500'"
          >
            <div class="flex items-center justify-between gap-2 px-3 py-2
                        border-b border-surface-200 dark:border-surface-600
                        bg-surface-100/60 dark:bg-surface-800/60">
              <h3 class="text-[11px] font-semibold uppercase tracking-[0.1em] text-surface-500 dark:text-surface-400 m-0">
                Binds B
                <span class="ml-1 font-normal normal-case tracking-normal tabular-nums text-surface-400">
                  {{ bindsCount(selectedSqlRow.bindsB) }}
                </span>
              </h3>
              <CopyButton
                label="Copy binds"
                title="Copy B binds to clipboard"
                :get-text="() => formatBindsPlain(selectedSqlRow.bindsB)"
              />
            </div>
            <pre
              class="font-mono text-[12px] leading-[1.5] whitespace-pre-wrap break-normal m-0 px-3 py-2.5
                     bg-surface-50 dark:bg-surface-900
                     text-surface-800 dark:text-surface-100 overflow-x-auto"
              v-html="formatBindsHtml(selectedSqlRow.bindsB)"
            ></pre>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="rounded px-2 py-1 text-[11px] font-medium cursor-pointer
                   text-surface-600 dark:text-surface-300
                   hover:bg-surface-100 dark:hover:bg-surface-700"
            @click="sqlDetailVisible = false; openDiffRow('sql', selectedSqlRow)"
          >
            Open in Database
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref, nextTick } from 'vue'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import hljs from 'highlight.js/lib/core'
import sql from 'highlight.js/lib/languages/sql'
import { prettyPrintJson } from 'pretty-print-json'
import { useEventsStore } from '../stores/events'
import { useSettingsStore } from '../stores/settings'
import { copyText } from './utils/clipboard'
import { ansiToHtml, stripAnsi } from './utils/ansi'
import { includesText } from './utils/useDetailSearch'
import { colFit } from './utils/columns'
import CompareTimedDiffTable from './CompareTimedDiffTable.vue'
import CompareSection from './CompareSection.vue'
import CopyButton from './CopyButton.vue'
import DetailSearch from './DetailSearch.vue'
import DetailsTable from './wrappers/DetailsTable.vue'
import FilepathLink from './FilepathLink.vue'

hljs.registerLanguage('sql', sql)

const prettyOptions = {
  indent: 2,
  quoteKeys: true,
  quoteStyle: 'double',
  trailingCommas: false,
  linkUrls: false,
}

const store = useEventsStore()
const settings = useSettingsStore()
const sqlFilter = ref('diff')
const paramFilter = ref('diff')
const cacheFilter = ref('diff')
const viewFilter = ref('diff')
const exceptionFilter = ref('diff')
const hideFrameworkParams = ref(true)
const paramsSearch = ref('')
const sqlSearch = ref('')
const cacheSearch = ref('')
const viewSearch = ref('')
const exceptionSearch = ref('')
const sqlDetailVisible = ref(false)
const selectedSqlRow = ref(null)
const sectionOpen = reactive({
  params: true,
  sql: true,
  cache: true,
  views: true,
  exceptions: true,
})
const ioMessage = ref('')
const ioError = ref(false)
let ioTimer = null

const paramSideCol = {
  ...colFit,
  verticalAlign: 'middle',
}
const paramNameCol = {
  width: '12%',
  whiteSpace: 'normal',
  overflow: 'hidden',
  verticalAlign: 'top',
}
/** Two flexible value columns (not both width:100% / colFill — that collapses to empty). */
const paramValueCol = {
  width: '40%',
  maxWidth: '0',
  whiteSpace: 'normal',
  overflow: 'hidden',
  verticalAlign: 'top',
}

const sqlDialogPt = {
  root: {
    class: [
      'rounded-lg shadow-xl',
      'border border-surface-200 dark:border-surface-600',
      '!max-w-[52rem] max-h-[90vh] m-0',
      'bg-surface-0 dark:bg-surface-800',
    ].join(' '),
  },
  header: {
    class: [
      'flex items-start justify-between gap-3 shrink-0',
      'px-5 pt-4 pb-3',
      'rounded-tl-lg rounded-tr-lg',
      'bg-surface-0 dark:bg-surface-800',
      'border-b border-surface-200 dark:border-surface-700',
      'text-surface-700 dark:text-surface-0/80',
    ].join(' '),
  },
  icons: { class: 'flex items-center shrink-0' },
  closeButton: {
    class: [
      'relative flex items-center justify-center',
      'w-7 h-7 border-0 rounded-full',
      'text-surface-500 bg-transparent',
      'transition duration-200 ease-in-out',
      'hover:text-surface-700 dark:hover:text-white/80',
      'hover:bg-surface-100 dark:hover:bg-surface-700',
      'focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400',
    ].join(' '),
  },
  content: {
    class: [
      'text-sm px-5 pt-4 pb-5',
      'rounded-bl-lg rounded-br-lg',
      'bg-surface-0 dark:bg-surface-800',
      'text-surface-600 dark:text-surface-0/70',
      'overflow-y-auto',
    ].join(' '),
  },
}
const jumpTabs = [
  { tab: 'timeline', label: 'Timeline' },
  { tab: 'params', label: 'Params' },
  { tab: 'database', label: 'DB' },
  { tab: 'rendering', label: 'Views' },
  { tab: 'cache', label: 'Cache' },
  { tab: 'log', label: 'Log' },
  { tab: 'error', label: 'Error' },
]

const sqlFilters = [
  { key: 'diff', label: 'Diff' },
  { key: 'all', label: 'All' },
  { key: 'added', label: 'Added' },
  { key: 'removed', label: 'Removed' },
  { key: 'slower', label: 'Slower' },
  { key: 'faster', label: 'Faster' },
  { key: 'n1', label: 'N+1' },
  { key: 'near', label: '≈ SQL' },
  { key: 'filter', label: 'Filter?' },
]

const paramFilters = [
  { key: 'diff', label: 'Diff' },
  { key: 'all', label: 'All' },
  { key: 'changed', label: 'Changed' },
  { key: 'added', label: 'Added' },
  { key: 'removed', label: 'Removed' },
]

const timedFilters = [
  { key: 'diff', label: 'Diff' },
  { key: 'all', label: 'All' },
  { key: 'added', label: 'Added' },
  { key: 'removed', label: 'Removed' },
  { key: 'slower', label: 'Slower' },
  { key: 'faster', label: 'Faster' },
]

const cacheFilters = [
  ...timedFilters,
  { key: 'hits', label: 'Hits' },
]

const countFilters = [
  { key: 'diff', label: 'Diff' },
  { key: 'all', label: 'All' },
  { key: 'added', label: 'Added' },
  { key: 'removed', label: 'Removed' },
]

const result = computed(() => store.compareResult)

const barRows = computed(() => {
  const r = result.value
  if (!r) return []
  const scale = r.scaleMs || 1
  const build = (slot, segments, total) => {
    const segs = segments
      .filter((s) => s.ms > 0.0005)
      .map((s) => ({
        ...s,
        pct: Math.max(0, Math.min(100, (s.ms / scale) * 100)),
      }))
    return {
      slot,
      segments: segs,
      total,
      title: segs.map((s) => `${s.label} ${formatMs(s.ms)}`).join(' · '),
    }
  }
  return [
    build('A', r.segmentsA, r.a.duration),
    build('B', r.segmentsB, r.b.duration),
  ]
})

const waterfallLanes = computed(() => {
  const r = result.value
  if (!r) return []
  return [
    { slot: 'A', spans: r.waterfallA || [] },
    { slot: 'B', spans: r.waterfallB || [] },
  ]
})

const visibleParamsBase = computed(() => {
  const rows = result.value?.paramsDiff || []
  if (!hideFrameworkParams.value) return rows
  return rows.filter((r) => !r.isFramework)
})

const filteredParams = computed(() => {
  const rows = visibleParamsBase.value
  switch (paramFilter.value) {
    case 'diff':
      return rows.filter((r) => r.side !== 'same')
    case 'changed':
      return rows.filter((r) => r.side === 'changed')
    case 'added':
      return rows.filter((r) => r.side === 'onlyB')
    case 'removed':
      return rows.filter((r) => r.side === 'onlyA')
    default:
      return rows
  }
})

const filteredSql = computed(() => {
  const rows = result.value?.sqlDiff || []
  switch (sqlFilter.value) {
    case 'diff':
      return rows.filter(
        (r) =>
          r.side !== 'both' ||
          r.deltaCount !== 0 ||
          isSignificantTimeDelta(r) ||
          r.isNPlusOneA !== r.isNPlusOneB
      )
    case 'added':
      return rows.filter((r) => r.side === 'onlyB' || isNearSqlAdded(r))
    case 'removed':
      return rows.filter((r) => r.side === 'onlyA' || isNearSqlRemoved(r))
    case 'slower':
      return rows.filter((r) => isSqlBothSides(r) && isSlower(r))
    case 'faster':
      return rows.filter((r) => isSqlBothSides(r) && isFaster(r))
    case 'n1':
      return rows.filter((r) => r.isNPlusOne)
    case 'near':
      return rows.filter((r) => r.nearMatch)
    case 'filter':
      return rows.filter((r) => r.likelyFilterDriven)
    default:
      return rows
  }
})

/** |Δtime| must beat max(ms floor, % of the larger side time). */
function timeDeltaThreshold(row) {
  const ms = Math.max(0, Number(settings.compareDiffMs) || 0)
  const pct = Math.max(0, Number(settings.compareDiffPct) || 0) / 100
  const ref = Math.max(Number(row.timeA) || 0, Number(row.timeB) || 0)
  return Math.max(ms, pct * ref)
}

function isSignificantTimeDelta(row) {
  return Math.abs(Number(row.deltaTime) || 0) > timeDeltaThreshold(row)
}

function isSlower(row) {
  return (Number(row.deltaTime) || 0) > timeDeltaThreshold(row)
}

function isFaster(row) {
  return (Number(row.deltaTime) || 0) < -timeDeltaThreshold(row)
}

/** Collapsed near-match rows participate like both-sides for timing filters. */
function isSqlBothSides(row) {
  return row.side === 'both' || row.side === 'near' || !!row.nearMatch
}

/** Near-match with a clause gained on B (or rewritten). */
function isNearSqlAdded(row) {
  if (row.side !== 'near' && !row.nearMatch) return false
  const kind = row.sqlClauseDiff?.kind
  return kind === 'added' || kind === 'changed'
}

/** Near-match with a clause lost on B (or rewritten). */
function isNearSqlRemoved(row) {
  if (row.side !== 'near' && !row.nearMatch) return false
  const kind = row.sqlClauseDiff?.kind
  return kind === 'removed' || kind === 'changed'
}

function filterTimed(rows, filter) {
  switch (filter) {
    case 'diff':
      return rows.filter(
        (r) =>
          r.side !== 'both' ||
          r.deltaCount !== 0 ||
          isSignificantTimeDelta(r) ||
          r.hitChanged
      )
    case 'added':
      return rows.filter((r) => r.side === 'onlyB')
    case 'removed':
      return rows.filter((r) => r.side === 'onlyA')
    case 'slower':
      return rows.filter((r) => r.side === 'both' && isSlower(r))
    case 'faster':
      return rows.filter((r) => r.side === 'both' && isFaster(r))
    case 'hits':
      return rows.filter((r) => r.hitChanged)
    default:
      return rows
  }
}

function filterCount(rows, filter) {
  switch (filter) {
    case 'diff':
      return rows.filter((r) => r.side !== 'both' || r.deltaCount !== 0)
    case 'added':
      return rows.filter((r) => r.side === 'onlyB')
    case 'removed':
      return rows.filter((r) => r.side === 'onlyA')
    default:
      return rows
  }
}

const filteredCache = computed(() => filterTimed(result.value?.cacheDiff || [], cacheFilter.value))
const filteredViews = computed(() => filterTimed(result.value?.viewDiff || [], viewFilter.value))
const filteredExceptions = computed(() => filterCount(result.value?.exceptionDiff || [], exceptionFilter.value))

function textFilter(rows, q, matchRow) {
  const needle = String(q || '').trim().toLowerCase()
  if (!needle) return rows
  return rows.filter((row) => matchRow(row, needle))
}

const displayedParams = computed(() =>
  textFilter(filteredParams.value, paramsSearch.value, (row, q) =>
    includesText(row.name, q) ||
    includesText(row.valueA, q) ||
    includesText(row.valueB, q)
  )
)

const displayedSql = computed(() =>
  textFilter(filteredSql.value, sqlSearch.value, (row, q) =>
    includesText(row.type, q) ||
    includesText(row.pattern, q) ||
    includesText(row.sample, q) ||
    includesText(row.sampleA, q) ||
    includesText(row.sampleB, q) ||
    includesText(row.patternA, q) ||
    includesText(row.patternB, q) ||
    includesText(row.sqlClauseDiff?.text, q) ||
    includesText(row.sqlClauseDiff?.textA, q) ||
    includesText(row.sqlClauseDiff?.textB, q) ||
    includesText(row.nearMatchPartnerSample, q) ||
    includesText(row.nearMatchPartnerPattern, q) ||
    relatedParamRows(row).some((p) =>
      includesText(p.name, q) ||
      includesText(p.valueA, q) ||
      includesText(p.valueB, q)
    )
  )
)

const displayedCache = computed(() =>
  textFilter(filteredCache.value, cacheSearch.value, (row, q) =>
    includesText(row.key, q) ||
    includesText(row.kind, q) ||
    includesText(row.typeSummary, q)
  )
)

const displayedViews = computed(() =>
  textFilter(filteredViews.value, viewSearch.value, (row, q) =>
    includesText(row.path, q) ||
    includesText(row.kind, q) ||
    includesText(row.typeSummary, q)
  )
)

const displayedExceptions = computed(() =>
  textFilter(filteredExceptions.value, exceptionSearch.value, (row, q) =>
    includesText(row.label, q) ||
    includesText(stripAnsi(row.sample || ''), q)
  )
)

function sideRank(side) {
  if (side === 'onlyA') return 0
  if (side === 'near') return 1
  if (side === 'both') return 2
  return 3
}

function paramSideRank(side) {
  if (side === 'changed') return 0
  if (side === 'onlyB') return 1
  if (side === 'onlyA') return 2
  return 3
}

function withTableKeys(rows, prefix) {
  return rows.map((r, i) => ({
    ...r,
    _key: `${prefix}-${i}`,
    _sideRank: sideRank(r.side),
  }))
}

const paramTableRows = computed(() =>
  displayedParams.value.map((r, i) => ({
    ...r,
    _key: `param-${i}-${r.name}`,
    _sideRank: paramSideRank(r.side),
  }))
)
const sqlTableRows = computed(() => withTableKeys(displayedSql.value, 'sql'))
const cacheTableRows = computed(() => withTableKeys(displayedCache.value, 'cache'))
const viewTableRows = computed(() => withTableKeys(displayedViews.value, 'view'))

function openSqlDetail(row) {
  selectedSqlRow.value = row
  sqlDetailVisible.value = true
}

function truncateSqlPreview(text, max = 96) {
  const s = String(text || '').replace(/\s+/g, ' ').trim()
  if (!s) return ''
  if (s.length <= max) return s
  return `${s.slice(0, max - 1)}…`
}

async function jumpToCompareParam(paramName) {
  const name = String(paramName || '').trim()
  if (!name) return
  sqlDetailVisible.value = false
  sectionOpen.params = true
  hideFrameworkParams.value = false
  paramFilter.value = 'all'
  paramsSearch.value = name
  await nextTick()
  document.querySelector('[data-compare-params]')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

function flashIo(message, isError = false) {
  clearTimeout(ioTimer)
  ioMessage.value = message
  ioError.value = isError
  ioTimer = setTimeout(() => {
    ioMessage.value = ''
    ioError.value = false
  }, 2500)
}

function openSide(side, tab) {
  store.openCompareSide(side, tab)
}

function openDiffRow(kind, row) {
  store.openCompareDiffRow(kind, row)
}

async function onCopyText() {
  try {
    const text = store.exportCompareText()
    if (!text) {
      flashIo('Nothing to copy', true)
      return
    }
    const ok = await copyText(text)
    flashIo(ok ? 'Copied compare' : 'Copy failed', !ok)
  } catch (err) {
    flashIo(err?.message || 'Copy failed', true)
  }
}

function onExportJson() {
  try {
    const payload = store.exportCompareJson()
    if (!payload) {
      flashIo('Nothing to export', true)
      return
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    a.href = url
    a.download = `rails-panel-compare-${stamp}.json`
    a.click()
    URL.revokeObjectURL(url)
    flashIo('Downloaded JSON')
  } catch (err) {
    flashIo(err?.message || 'Export failed', true)
  }
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

function formatMetric(value, unit) {
  if (unit === 'count') return String(Math.round(Number(value) || 0))
  return formatMs(value)
}

function formatMetricDelta(row) {
  if (row.unit === 'count') return formatSignedCount(row.delta)
  const ms = formatSignedMs(row.delta)
  if (row.deltaPct == null) return ms
  return `${ms} (${formatSignedPct(row.deltaPct)})`
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
  if (row.side === 'near' || row.nearMatch) return 'A≈B'
  return 'A-B'
}

function nearMatchTitle(row) {
  const parts = ['Near-match SQL (same shape, different clause)']
  const d = row.sqlClauseDiff
  if (d?.kind === 'added') parts.push(`+ ${d.text}`)
  else if (d?.kind === 'removed') parts.push(`− ${d.text}`)
  else if (d?.kind === 'changed') parts.push(`${d.textA} → ${d.textB}`)
  const names = relatedParamNames(row)
  if (row.likelyFilterDriven && names.length) {
    parts.push(`Filter? params: ${names.join(', ')}`)
  }
  return parts.join(' · ')
}

function relatedParamRows(row) {
  return (row?.relatedParams || []).map((p) => (
    typeof p === 'string' ? { name: p } : p
  )).filter((p) => p?.name)
}

function relatedParamNames(row) {
  return relatedParamRows(row).map((p) => p.name)
}

function filterHintTitle(row) {
  const names = relatedParamNames(row)
  if (!names.length) return 'Likely filter-driven (params changed + SQL add/remove/count)'
  return `Likely filter-driven · params: ${names.join(', ')}`
}

function sideBadgeClass(row) {
  if (row.side === 'onlyA') {
    return 'bg-surface-200 text-surface-800 dark:bg-surface-600 dark:text-surface-100'
  }
  if (row.side === 'onlyB') {
    return 'bg-primary-500/20 text-primary-800 dark:text-primary-200 ring-1 ring-primary-500/35'
  }
  if (row.side === 'near' || row.nearMatch) {
    return 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-200 ring-1 ring-cyan-500/30'
  }
  return 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300'
}

function exceptionSideBadgeClass(row) {
  if (row.side === 'onlyA') {
    return 'bg-red-600/15 text-red-800 dark:text-red-200 ring-1 ring-red-500/35'
  }
  if (row.side === 'onlyB') {
    return 'bg-red-600 text-white dark:bg-red-500'
  }
  return 'bg-red-500/10 text-red-700 dark:text-red-300 ring-1 ring-red-500/25'
}

function paramSideLabel(row) {
  if (row.side === 'onlyA') return 'A'
  if (row.side === 'onlyB') return 'B'
  if (row.side === 'changed') return 'changed'
  return 'same'
}

function paramSideBadgeClass(row) {
  if (row.side === 'changed') {
    return 'bg-amber-500/20 text-amber-800 dark:text-amber-300 ring-1 ring-amber-500/35'
  }
  return sideBadgeClass(row)
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function prettyParam(raw, fallback) {
  if (raw === undefined) {
    return `<span class="text-surface-400 dark:text-surface-500">${escapeHtml(fallback || '—')}</span>`
  }
  try {
    if (typeof raw === 'string') {
      try {
        return prettyPrintJson.toHtml(JSON.parse(raw), prettyOptions)
      } catch {
        return escapeHtml(raw)
      }
    }
    return prettyPrintJson.toHtml(raw, prettyOptions)
  } catch {
    return escapeHtml(fallback ?? raw)
  }
}

function paramTitle(raw, fallback) {
  if (raw === undefined) return String(fallback || '')
  try {
    if (typeof raw !== 'string') return JSON.stringify(raw, null, 2)
  } catch { /* ignore */ }
  return String(fallback ?? raw ?? '')
}

function highlightSql(query) {
  const q = String(query || '')
  if (!q) return ''
  try {
    return hljs.highlight(q, { language: 'sql' }).value
  } catch {
    return escapeHtml(q)
  }
}

function hasBinds(binds) {
  if (binds == null) return false
  if (Array.isArray(binds)) return binds.length > 0
  if (typeof binds === 'object') return Object.keys(binds).length > 0
  return String(binds).length > 0
}

function bindsCount(binds) {
  if (Array.isArray(binds)) return binds.length
  if (binds && typeof binds === 'object') return Object.keys(binds).length
  return 1
}

function formatBindsPlain(binds) {
  try {
    return JSON.stringify(binds, null, 2)
  } catch {
    return String(binds)
  }
}

function formatBindsHtml(binds) {
  try {
    return prettyPrintJson.toHtml(binds, prettyOptions)
  } catch {
    try {
      return escapeHtml(JSON.stringify(binds, null, 2))
    } catch {
      return escapeHtml(String(binds))
    }
  }
}

function bindsChanged(row) {
  if (!row) return false
  if (!hasBinds(row.bindsA) || !hasBinds(row.bindsB)) return false
  try {
    return JSON.stringify(row.bindsA) !== JSON.stringify(row.bindsB)
  } catch {
    return String(row.bindsA) !== String(row.bindsB)
  }
}

</script>

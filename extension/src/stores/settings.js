import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { editors } from '../configs/editors'

const defaultEditor = editors[0].id

const DEFAULTS = {
  requestCap: 100,
  outlierMs: 300,
  outlierPct: 10,
  idleGapMs: 150,
  idleGapPct: 8,
  nPlusOneMin: 3,
  compareDiffMs: 1,
  compareDiffPct: 5,
}

function readBool(key, fallback = false) {
  const raw = localStorage.getItem(key)
  if (raw == null) return fallback
  return raw === 'true'
}

function readNumber(key, fallback) {
  const raw = localStorage.getItem(key)
  if (raw == null || raw === '') return fallback
  const n = Number(raw)
  return Number.isFinite(n) ? n : fallback
}

function clampInt(n, min, max, fallback) {
  if (n === '' || n == null) return fallback
  const v = Math.round(Number(n))
  if (!Number.isFinite(v)) return fallback
  return Math.min(max, Math.max(min, v))
}

/**
 * Persist only valid numbers. Empty / NaN inputs must NOT clamp to `min`
 * (that bug saved Slow/Heavy as 50ms / 1%).
 */
function watchInt(source, key, { min, max, fallback }) {
  watch(source, (newVal) => {
    if (newVal === '' || newVal == null) return
    const parsed = Number(newVal)
    if (!Number.isFinite(parsed)) return
    const v = clampInt(parsed, min, max, fallback)
    if (v !== source.value) source.value = v
    else localStorage.setItem(key, String(v))
  })
}

// One-shot: drop corrupt Slow/Heavy values written by the empty-input clamp bug.
;(function migrateCorruptOutlierThresholds() {
  if (localStorage.getItem('railspanel.outlierDefaults') === '300-10') return
  localStorage.removeItem('railspanel.outlierMs')
  localStorage.removeItem('railspanel.outlierPct')
  localStorage.setItem('railspanel.outlierDefaults', '300-10')
})()

export const useSettingsStore = defineStore('settings', () => {
  const filepathLinkBehaviour = ref(localStorage.getItem('railspanel.filepathLinkBehaviour') || 'copy')
  const editor = ref(
    editors.find((e) => e.id == (localStorage.getItem('railspanel.editor') || defaultEditor)) ||
      editors[0]
  )
  const lockOn = ref(readBool('railspanel.lockOn', false))

  const requestCap = ref(
    clampInt(readNumber('railspanel.requestCap', DEFAULTS.requestCap), 10, 1000, DEFAULTS.requestCap)
  )

  const outlierMs = ref(
    clampInt(readNumber('railspanel.outlierMs', DEFAULTS.outlierMs), 50, 10000, DEFAULTS.outlierMs)
  )
  const outlierPct = ref(
    clampInt(readNumber('railspanel.outlierPct', DEFAULTS.outlierPct), 1, 50, DEFAULTS.outlierPct)
  )

  const idleGapMs = ref(
    clampInt(readNumber('railspanel.idleGapMs', DEFAULTS.idleGapMs), 20, 10000, DEFAULTS.idleGapMs)
  )
  const idleGapPct = ref(
    clampInt(readNumber('railspanel.idleGapPct', DEFAULTS.idleGapPct), 1, 50, DEFAULTS.idleGapPct)
  )

  const nPlusOneMin = ref(
    clampInt(readNumber('railspanel.nPlusOneMin', DEFAULTS.nPlusOneMin), 2, 50, DEFAULTS.nPlusOneMin)
  )

  const compareDiffMs = ref(
    clampInt(readNumber('railspanel.compareDiffMs', DEFAULTS.compareDiffMs), 0, 1000, DEFAULTS.compareDiffMs)
  )
  const compareDiffPct = ref(
    clampInt(readNumber('railspanel.compareDiffPct', DEFAULTS.compareDiffPct), 0, 50, DEFAULTS.compareDiffPct)
  )
  const compareCompactSql = ref(readBool('railspanel.compareCompactSql', false))

  watch(editor, (newVal) => {
    localStorage.setItem('railspanel.editor', newVal.id)
  })

  watch(filepathLinkBehaviour, (newVal) => {
    localStorage.setItem('railspanel.filepathLinkBehaviour', newVal)
  })

  watch(lockOn, (newVal) => {
    localStorage.setItem('railspanel.lockOn', String(newVal))
  })

  watch(compareCompactSql, (newVal) => {
    localStorage.setItem('railspanel.compareCompactSql', String(newVal))
  })

  watchInt(requestCap, 'railspanel.requestCap', { min: 10, max: 1000, fallback: DEFAULTS.requestCap })
  watchInt(outlierMs, 'railspanel.outlierMs', { min: 50, max: 10000, fallback: DEFAULTS.outlierMs })
  watchInt(outlierPct, 'railspanel.outlierPct', { min: 1, max: 50, fallback: DEFAULTS.outlierPct })
  watchInt(idleGapMs, 'railspanel.idleGapMs', { min: 20, max: 10000, fallback: DEFAULTS.idleGapMs })
  watchInt(idleGapPct, 'railspanel.idleGapPct', { min: 1, max: 50, fallback: DEFAULTS.idleGapPct })
  watchInt(nPlusOneMin, 'railspanel.nPlusOneMin', { min: 2, max: 50, fallback: DEFAULTS.nPlusOneMin })
  watchInt(compareDiffMs, 'railspanel.compareDiffMs', { min: 0, max: 1000, fallback: DEFAULTS.compareDiffMs })
  watchInt(compareDiffPct, 'railspanel.compareDiffPct', { min: 0, max: 50, fallback: DEFAULTS.compareDiffPct })

  return {
    editors,
    editor,
    filepathLinkBehaviour,
    lockOn,
    requestCap,
    outlierMs,
    outlierPct,
    idleGapMs,
    idleGapPct,
    nPlusOneMin,
    compareDiffMs,
    compareDiffPct,
    compareCompactSql,
  }
})

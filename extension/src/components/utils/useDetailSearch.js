import { computed, ref, watch } from 'vue'
import { useEventsStore } from '../../stores/events'

/**
 * Client-side filter for detail panels. Clears when the selected request changes.
 * @param {() => any[]} getRows
 * @param {(row: any, q: string) => boolean} matchRow
 */
export function useDetailSearch(getRows, matchRow) {
  const store = useEventsStore()
  const query = ref('')

  watch(
    () => store.selectedRequest?.id,
    () => {
      query.value = ''
    }
  )

  const normalized = computed(() => query.value.trim().toLowerCase())

  const filteredRows = computed(() => {
    const rows = getRows() || []
    const q = normalized.value
    if (!q) return rows
    return rows.filter((row) => matchRow(row, q))
  })

  const isFiltering = computed(() => normalized.value.length > 0)

  return { query, filteredRows, isFiltering, matchCount: computed(() => filteredRows.value.length) }
}

export function includesText(value, q) {
  if (value == null) return false
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value).toLowerCase().includes(q)
  }
  try {
    return JSON.stringify(value).toLowerCase().includes(q)
  } catch {
    return String(value).toLowerCase().includes(q)
  }
}

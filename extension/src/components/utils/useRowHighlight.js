import { nextTick, watch } from 'vue'
import { useEventsStore } from '../../stores/events'

/**
 * Highlight detail-table rows whose sourceKey is in the store highlight list,
 * and scroll the first match into view.
 */
export function useRowHighlight(getRows) {
  const store = useEventsStore()

  function rowClass(data) {
    return store.isDetailHighlighted(data.sourceKey) ? 'rp-row-highlight' : ''
  }

  watch(
    () => [store.detailHighlightKeys.slice(), store.selectedRequest?.id],
    async ([keys]) => {
      if (!keys?.length) return
      await nextTick()
      await nextTick()
      const el = document.querySelector('.rp-row-highlight')
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    },
    { flush: 'post', immediate: true }
  )

  // Optional: clear highlight after a few seconds so it doesn't stick forever
  watch(
    () => store.detailHighlightKeys.slice(),
    (keys) => {
      if (!keys?.length) return
      const snapshot = keys.join('|')
      window.setTimeout(() => {
        if (store.detailHighlightKeys.join('|') === snapshot) {
          store.clearDetailHighlight()
        }
      }, 4000)
    },
    { immediate: true }
  )

  return { rowClass }
}

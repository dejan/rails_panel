import { nextTick, onBeforeUnmount, onMounted } from 'vue'

const MIN_COL_PX = 48
const MEASURE_PAD_PX = 20

/**
 * Double-click a column header → that column grows to its content width;
 * the other columns shrink to make room (down to a minimum).
 * Widths are session-only — nothing is written to localStorage.
 */
export function useHeaderColumnFit(rootRef, { enabled = () => true } = {}) {
  let styleEl = null
  let token = null

  function isEnabled() {
    return typeof enabled === 'function' ? enabled() : !!enabled
  }

  function findDataTable(root) {
    return root?.querySelector?.('[data-pc-name="datatable"]') || null
  }

  function findTables(root) {
    const dt = findDataTable(root)
    const scope = dt || root
    return Array.from(scope.querySelectorAll('table[data-pc-section="table"], table'))
  }

  function headerCells(table) {
    return Array.from(
      table.querySelectorAll('thead[data-pc-section="thead"] > tr > th, thead > tr > th')
    )
  }

  function bodyCells(table, colIndex) {
    return Array.from(
      table.querySelectorAll(
        `tbody[data-pc-section="tbody"] > tr > td:nth-child(${colIndex + 1}), tbody > tr > td:nth-child(${colIndex + 1})`
      )
    )
  }

  function measureNaturalWidth(el) {
    if (!el) return 0
    const clone = el.cloneNode(true)
    clone.style.cssText = [
      'position:absolute',
      'visibility:hidden',
      'height:auto',
      'width:max-content',
      'max-width:none',
      'min-width:0',
      'white-space:nowrap',
      'overflow:visible',
      'text-overflow:clip',
      'pointer-events:none',
      'left:-10000px',
      'top:0',
      'box-sizing:border-box',
    ].join(';')
    clone.querySelectorAll('*').forEach((node) => {
      if (!(node instanceof HTMLElement)) return
      node.style.maxWidth = 'none'
      node.style.width = 'auto'
      node.style.overflow = 'visible'
      node.style.textOverflow = 'clip'
      node.style.whiteSpace = 'nowrap'
    })
    document.body.appendChild(clone)
    const width = Math.ceil(clone.getBoundingClientRect().width)
    document.body.removeChild(clone)
    return width
  }

  function measureColumnContent(tables, colIndex) {
    let max = 0
    for (const table of tables) {
      const headers = headerCells(table)
      if (headers[colIndex]) {
        max = Math.max(max, measureNaturalWidth(headers[colIndex]))
      }
      const cells = bodyCells(table, colIndex)
      const limit = Math.min(cells.length, 100)
      for (let i = 0; i < limit; i++) {
        max = Math.max(max, measureNaturalWidth(cells[i]))
      }
    }
    return Math.max(MIN_COL_PX, max + MEASURE_PAD_PX)
  }

  function tableWidthPx(tables) {
    for (const table of tables) {
      const w = Math.floor(table.getBoundingClientRect().width)
      if (w > 0) return w
    }
    const dt = findDataTable(rootRef.value)
    return Math.floor(dt?.getBoundingClientRect().width || 0)
  }

  function findDataTableProxy(root) {
    const el = findDataTable(root)
    if (!el) return null
    let comp = el.__vueParentComponent
    while (comp) {
      const proxy = comp.proxy
      if (proxy && typeof proxy.addColumnWidthStyles === 'function') return proxy
      comp = comp.parent
    }
    return null
  }

  function dtAttributeSelector(root) {
    const el = findDataTable(root)
    if (!el) return null
    for (const attr of el.attributes) {
      if (attr.value === '' && attr.name !== 'data-pc-name') {
        return attr.name
      }
    }
    return null
  }

  function applyWidths(root, widths) {
    const proxy = findDataTableProxy(root)
    if (proxy) {
      try {
        proxy.destroyStyleElement?.()
        proxy.addColumnWidthStyles(widths)
        // Do not saveState — column widths must not hit localStorage.
        return
      } catch {
        // fall through
      }
    }
    applyManualStyles(root, widths)
  }

  function applyManualStyles(root, widths) {
    if (!token) token = `rp-fit-${Math.random().toString(36).slice(2, 9)}`
    const dt = findDataTable(root) || root
    dt.setAttribute('data-rp-colfit', token)

    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.setAttribute('data-rp-colfit-style', token)
      document.head.appendChild(styleEl)
    }

    const attr = dtAttributeSelector(root)
    const base = attr
      ? `[data-pc-name="datatable"][${attr}]`
      : `[data-pc-name="datatable"][data-rp-colfit="${token}"]`

    styleEl.innerHTML = widths
      .map((width, index) => {
        const i = index + 1
        const style = `width:${width}px !important;max-width:${width}px !important`
        return `
${base} table > thead > tr > th:nth-child(${i}),
${base} table > tbody > tr > td:nth-child(${i}),
${base} table > tfoot > tr > td:nth-child(${i}){${style}}`
      })
      .join('')
  }

  function expandToContent(root, colIndex) {
    const tables = findTables(root)
    if (!tables.length) return

    const headers = headerCells(tables[0])
    const count = headers.length
    if (colIndex < 0 || colIndex >= count) return

    const totalWidth = tableWidthPx(tables)
    if (totalWidth <= 0) return

    const contentWidth = measureColumnContent(tables, colIndex)
    const others = count - 1
    const minOthers = others * MIN_COL_PX
    const targetWidth = Math.min(contentWidth, Math.max(MIN_COL_PX, totalWidth - minOthers))

    const widths = Array(count).fill(MIN_COL_PX)
    widths[colIndex] = targetWidth

    const remaining = totalWidth - targetWidth
    const otherIndexes = []
    for (let i = 0; i < count; i++) {
      if (i !== colIndex) otherIndexes.push(i)
    }
    if (otherIndexes.length) {
      const base = Math.floor(remaining / otherIndexes.length)
      let used = 0
      otherIndexes.forEach((index, order) => {
        if (order === otherIndexes.length - 1) {
          widths[index] = Math.max(MIN_COL_PX, remaining - used)
        } else {
          const w = Math.max(MIN_COL_PX, base)
          widths[index] = w
          used += w
        }
      })
    }

    applyWidths(root, widths)
  }

  function columnIndexFromTh(tables, th) {
    for (const table of tables) {
      const idx = headerCells(table).indexOf(th)
      if (idx >= 0) return idx
    }
    const row = th.parentElement
    if (!row) return -1
    return Array.from(row.children).indexOf(th)
  }

  function onDblClick(event) {
    if (!isEnabled()) return
    const root = rootRef.value
    if (!root) return
    const th = event.target?.closest?.('th')
    if (!th || !root.contains(th)) return
    if (event.target?.closest?.('[data-pc-section="columnresizer"]')) return

    const tables = findTables(root)
    if (!tables.length) return

    const colIndex = columnIndexFromTh(tables, th)
    if (colIndex < 0) return

    event.preventDefault()
    event.stopPropagation()
    expandToContent(root, colIndex)
  }

  function annotateHeaders() {
    const root = rootRef.value
    if (!root) return
    for (const table of findTables(root)) {
      headerCells(table).forEach((th) => {
        th.title = 'Double-click to fit column to content'
      })
    }
  }

  onMounted(() => {
    const root = rootRef.value
    if (!root) return
    root.addEventListener('dblclick', onDblClick)
    nextTick(() => annotateHeaders())
    setTimeout(annotateHeaders, 250)
  })

  onBeforeUnmount(() => {
    rootRef.value?.removeEventListener?.('dblclick', onDblClick)
    if (styleEl?.parentNode) styleEl.parentNode.removeChild(styleEl)
    styleEl = null
  })
}

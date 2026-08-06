import Convert from 'ansi-to-html'

const convert = new Convert({
  escapeXml: true,
  newline: false,
})

/**
 * Rails / ActiveSupport sometimes emit CSI sequences without ESC (\u001b),
 * e.g. "[1m[35mSQL…" instead of "\u001b[1m\u001b[35mSQL…".
 * Re-attach ESC so ansi-to-html can parse them.
 */
export function ensureAnsiEscapes(text) {
  // Avoid lookbehind for broader Chromium/DevTools compatibility.
  return String(text ?? '').replace(/(\u001b)?\[(\d{1,3}(?:;\d{1,3})*)m/g, '\u001b[$2m')
}

/** Strip ANSI / orphaned CSI color codes for grouping & search. */
export function stripAnsi(text) {
  return String(text ?? '')
    .replace(/\u001b\[[0-9;]*m/g, '')
    .replace(/\[(\d{1,3}(?:;\d{1,3})*)m/g, '')
}

/** Convert ANSI-colored log text to safe HTML. */
export function ansiToHtml(text) {
  const raw = String(text ?? '')
  if (!raw) return ''
  return convert.toHtml(ensureAnsiEscapes(raw))
}

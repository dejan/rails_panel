// Clipboard helpers for the offscreen document (write + read).
// The DevTools panel cannot use navigator.clipboard (Permissions-Policy).
// This offscreen extension page can, and can also use execCommand with
// clipboardRead / clipboardWrite permissions.

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.target !== 'offscreen-doc') return

  if (message.type === 'copy-data-to-clipboard') {
    try {
      handleClipboardWrite(message.data)
      sendResponse({ ok: true })
    } catch (err) {
      sendResponse({ ok: false, error: String(err?.message || err) })
    }
    return false
  }

  if (message.type === 'read-data-from-clipboard') {
    handleClipboardRead()
      .then((text) => sendResponse({ ok: true, text }))
      .catch((err) => sendResponse({ ok: false, error: String(err?.message || err) }))
    return true
  }
})

const textEl = document.querySelector('#text')

function handleClipboardWrite(data) {
  if (typeof data !== 'string') {
    throw new TypeError(`Value provided must be a 'string', got '${typeof data}'.`)
  }
  textEl.value = data
  textEl.focus()
  textEl.select()
  const ok = document.execCommand('copy')
  if (!ok) {
    throw new Error('document.execCommand(copy) failed')
  }
}

async function handleClipboardRead() {
  // Prefer execCommand('paste') — works in extension pages with clipboardRead
  // and avoids Permissions-Policy issues seen in DevTools panels.
  textEl.value = ''
  textEl.focus()
  const pasted = document.execCommand('paste')
  if (pasted && textEl.value !== '') {
    return textEl.value
  }

  // Fallback for environments where execCommand paste is disabled.
  if (navigator.clipboard?.readText) {
    try {
      const text = await navigator.clipboard.readText()
      if (typeof text === 'string') return text
    } catch {
      /* ignore */
    }
  }

  throw new Error('Clipboard read unavailable in offscreen document')
}

function isExtensionRuntime() {
  try {
    return typeof chrome !== 'undefined' && !!chrome.runtime?.id
  } catch {
    return false
  }
}

/**
 * Copy plain text via the extension service worker + offscreen document.
 * Never call navigator.clipboard from the DevTools panel — Edge/Chrome apply a
 * Permissions-Policy that blocks Clipboard API there (crbug.com/414348233).
 */
export async function copyText(text) {
  const value = String(text ?? '')

  if (isExtensionRuntime()) {
    try {
      const res = await chrome.runtime.sendMessage({ action: 'copyToClipboard', text: value })
      if (chrome.runtime.lastError) return false
      return res?.ok !== false
    } catch {
      return false
    }
  }

  // Standalone / vite preview only.
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return false
  }
}

/**
 * Read clipboard text via offscreen document (clipboardRead permission).
 * Do not use navigator.clipboard in the DevTools panel.
 */
export async function readClipboardText() {
  if (isExtensionRuntime()) {
    try {
      const res = await chrome.runtime.sendMessage({ action: 'readFromClipboard' })
      if (chrome.runtime.lastError) return null
      if (res?.ok && typeof res.text === 'string') return res.text
      return null
    } catch {
      return null
    }
  }

  try {
    if (navigator.clipboard?.readText) {
      return await navigator.clipboard.readText()
    }
  } catch {
    /* ignore */
  }
  return null
}

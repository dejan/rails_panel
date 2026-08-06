chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'getJSON') {
    fetchMetaRequestJson(message.url)
      .then((data) => sendResponse(data))
      .catch((err) => sendResponse({ __error: String(err?.message || err) }))
    return true // keep channel open for async response
  }

  if (message.action === 'copyToClipboard') {
    addToClipboard(message.text)
      .then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: String(err?.message || err) }))
    return true
  }

  if (message.action === 'readFromClipboard') {
    readFromClipboard()
      .then((text) => sendResponse({ ok: true, text }))
      .catch((err) => sendResponse({ ok: false, error: String(err?.message || err) }))
    return true
  }
})

function normalizeFetchUrl(url) {
  if (typeof url === 'string') return url
  if (url && typeof url === 'object') {
    if (typeof url.href === 'string') return url.href
    if (typeof url.toString === 'function') {
      const s = url.toString()
      if (s && s !== '[object Object]') return s
    }
  }
  throw new Error('Invalid meta_request URL')
}

async function fetchMetaRequestJson(rawUrl) {
  const url = normalizeFetchUrl(rawUrl)
  const resp = await fetch(url)
  const text = await resp.text()

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} for ${url}`)
  }

  const trimmed = text.trim()
  if (!trimmed) throw new Error(`Empty response for ${url}`)
  if (trimmed.startsWith('<!') || trimmed.startsWith('<html') || trimmed.startsWith('<HTML')) {
    // Rails/HTML page instead of meta_request JSON (wrong route, auth wall, etc.)
    throw new Error(`Expected JSON from meta_request, got HTML (${url})`)
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    throw new Error(`Invalid JSON from meta_request (${url})`)
  }
}

// https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/cookbook.offscreen-clipboard-write
// + getContexts guard so a second Copy doesn't fail with "Only a single offscreen document"

let creatingOffscreen = null

async function setupOffscreenDocument(path) {
  const offscreenUrl = chrome.runtime.getURL(path)
  if (chrome.runtime.getContexts) {
    const existing = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT'],
      documentUrls: [offscreenUrl],
    })
    if (existing.length > 0) return
  }

  if (creatingOffscreen) {
    await creatingOffscreen
    return
  }

  creatingOffscreen = chrome.offscreen.createDocument({
    url: path,
    reasons: [chrome.offscreen.Reason.CLIPBOARD],
    justification: 'Read and write text on the system clipboard.',
  })
  try {
    await creatingOffscreen
  } finally {
    creatingOffscreen = null
  }
}

async function closeOffscreenDocument() {
  try {
    if (chrome.offscreen?.closeDocument) {
      await chrome.offscreen.closeDocument()
    }
  } catch {
    // Already closed.
  }
}

async function addToClipboard(value) {
  await setupOffscreenDocument('offscreen.html')
  try {
    await chrome.runtime.sendMessage({
      type: 'copy-data-to-clipboard',
      target: 'offscreen-doc',
      data: String(value ?? ''),
    })
  } finally {
    await closeOffscreenDocument()
  }
}

async function readFromClipboard() {
  await setupOffscreenDocument('offscreen.html')
  try {
    const res = await chrome.runtime.sendMessage({
      type: 'read-data-from-clipboard',
      target: 'offscreen-doc',
    })
    if (!res?.ok) {
      throw new Error(res?.error || 'Clipboard read failed')
    }
    return String(res.text ?? '')
  } finally {
    await closeOffscreenDocument()
  }
}

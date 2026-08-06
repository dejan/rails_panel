function osPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** False after the extension was reloaded while this DevTools panel stayed open. */
export function isExtensionContextValid() {
  try {
    return typeof chrome !== 'undefined' && !!chrome.runtime?.id
  } catch {
    return false
  }
}

function themeNameIsDark(name) {
  return name === 'dark'
}

function devtoolsPrefersDark() {
  if (!isExtensionContextValid()) return null
  try {
    const name = chrome?.devtools?.panels?.themeName
    if (name === 'dark') return true
    if (name === 'default' || name === 'light') return false
  } catch (_) {
    // Panel may be tearing down / context invalidated.
  }
  return null
}

/**
 * Prefer DevTools theme when available (matches surrounding DevTools chrome).
 * Fall back to OS / browser prefers-color-scheme.
 */
export function isDarkTheme() {
  const fromDevtools = devtoolsPrefersDark()
  if (fromDevtools !== null) return fromDevtools
  return osPrefersDark()
}

export function applyTheme() {
  const root = document.documentElement
  if (!root) return

  const dark = isDarkTheme()
  root.classList.toggle('dark', dark)
  root.classList.toggle('light', !dark)
}

export function watchTheme() {
  applyTheme()

  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const onSchemeChange = () => applyTheme()
  mq.addEventListener('change', onSchemeChange)

  let timer = null
  let lastDevtools = devtoolsPrefersDark()

  if (isExtensionContextValid() && chrome.devtools?.panels) {
    // Official live update (Chrome 99+) — no reload needed when DevTools theme flips.
    if (typeof chrome.devtools.panels.setThemeChangeHandler === 'function') {
      try {
        chrome.devtools.panels.setThemeChangeHandler((theme) => {
          lastDevtools = themeNameIsDark(theme)
          applyTheme()
        })
      } catch (_) {
        // Ignore if context can't register the handler.
      }
    }

    // Fallback poll for older Chrome / missed handler events.
    timer = setInterval(() => {
      if (!document.documentElement || !isExtensionContextValid()) {
        clearInterval(timer)
        timer = null
        return
      }
      try {
        const current = devtoolsPrefersDark()
        if (current !== lastDevtools) {
          lastDevtools = current
          applyTheme()
        }
      } catch {
        clearInterval(timer)
        timer = null
      }
    }, 500)
  }

  const onVisible = () => {
    if (document.visibilityState === 'visible' && isExtensionContextValid()) applyTheme()
  }
  document.addEventListener('visibilitychange', onVisible)

  const cleanup = () => {
    mq.removeEventListener('change', onSchemeChange)
    document.removeEventListener('visibilitychange', onVisible)
    if (timer) clearInterval(timer)
    try {
      if (isExtensionContextValid() && chrome.devtools?.panels?.setThemeChangeHandler) {
        chrome.devtools.panels.setThemeChangeHandler(null)
      }
    } catch (_) {
      /* ignore */
    }
  }
  window.addEventListener('pagehide', cleanup)
  window.addEventListener('unload', cleanup)
}

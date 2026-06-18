const THEME_KEY = 'sc2026_theme'

/** Apply a theme string ('light' | 'dark') to the document root. */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
}

/** Read system preference as a fallback. */
function systemPreference() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Initialise theme on page load. Returns the active theme. */
export function initTheme() {
  const stored = localStorage.getItem(THEME_KEY)
  const theme  = stored ?? systemPreference()
  applyTheme(theme)
  return theme
}

/** Toggle between light and dark. Returns the new theme. */
export function toggleTheme() {
  const current = document.documentElement.dataset.theme ?? 'light'
  const next    = current === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  localStorage.setItem(THEME_KEY, next)
  return next
}

/** Get the current active theme. */
export function getTheme() {
  return document.documentElement.dataset.theme ?? 'light'
}

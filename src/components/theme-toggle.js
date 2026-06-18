import { initTheme, toggleTheme, getTheme } from '../lib/theme.js'

/**
 * Mount a floating theme toggle button and initialise the active theme.
 * Safe to call on both the public site and the admin panel.
 */
export function mountThemeToggle() {
  initTheme()

  const btn = document.createElement('button')
  btn.className = 'theme-toggle'
  btn.setAttribute('aria-label', 'Toggle dark / light theme')
  btn.setAttribute('title', 'Toggle theme')

  const icon  = document.createElement('span')
  icon.className = 'theme-toggle__icon'

  const label = document.createElement('span')
  label.className = 'theme-toggle__label'

  btn.appendChild(icon)
  btn.appendChild(label)
  document.body.appendChild(btn)

  function sync() {
    const isDark = getTheme() === 'dark'
    icon.textContent  = isDark ? '☀️' : '🌙'
    label.textContent = isDark ? 'Light' : 'Dark'
    icon.style.transform = isDark ? 'rotate(180deg)' : 'rotate(0deg)'
  }

  sync()

  btn.addEventListener('click', () => {
    toggleTheme()
    sync()
  })

  // Also sync when system preference changes (e.g. OS switches to dark mode)
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (!localStorage.getItem('sc2026_theme')) {
        // Only follow system if user hasn't set a preference
        sync()
      }
    })
}

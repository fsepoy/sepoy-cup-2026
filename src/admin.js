import { fetchTournamentData } from './lib/data.js'
import { renderAdminHeader } from './components/admin/header.js'
import { renderPatSection } from './components/admin/pat-section.js'
import { renderScoresSection } from './components/admin/scores-section.js'
import { renderDangerSection } from './components/admin/danger-section.js'
import { showToast } from './components/admin/toast.js'
import { mountThemeToggle } from './components/theme-toggle.js'

mountThemeToggle()

async function init() {
  document.body.classList.add('admin-body')
  document.querySelector('#admin-app').style.cssText =
    'max-width:var(--max-width);margin:0 auto;padding:32px clamp(16px,4vw,40px);min-height:100vh;'

  renderAdminHeader(document.getElementById('admin-header'))
  renderPatSection(document.getElementById('pat-section'))

  const { ok, data, error } = await fetchTournamentData()

  if (!ok) {
    showToast(`Failed to load data: ${error}`, 'error')
    return
  }

  renderScoresSection(document.getElementById('scores-section'), data)
  renderDangerSection(document.getElementById('danger-section'), data)
}

init()

import { fetchTournamentData } from './lib/data.js'
import { renderHero } from './components/hero.js'
import { renderGroups } from './components/groups.js'
import { renderFixtures } from './components/fixtures.js'
import { renderBracket } from './components/bracket.js'
import { renderChampion } from './components/champion.js'
import { mountThemeToggle } from './components/theme-toggle.js'

mountThemeToggle()

async function init() {
  const loading = document.createElement('div')
  loading.className = 'loading'
  loading.innerHTML = '<div class="spinner"></div> Loading tournament data…'
  document.getElementById('app').prepend(loading)

  const { ok, data, error } = await fetchTournamentData()

  loading.remove()

  if (!ok) {
    const errEl = document.createElement('div')
    errEl.className = 'loading'
    errEl.innerHTML = '<span>Failed to load tournament data — check your connection and try again.</span>'
    document.getElementById('app').appendChild(errEl)
    return
  }

  renderHero(document.getElementById('hero'), data)
  renderGroups(document.getElementById('groups'), data)
  renderFixtures(document.getElementById('fixtures'), data)
  renderBracket(document.getElementById('bracket'), data)
  renderChampion(document.getElementById('champion'), data)
}

init()

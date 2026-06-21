import { getPat } from './pat-section.js'
import { getFileMeta, writeData } from '../../lib/github.js'
import { resolveBracket } from '../../lib/knockout.js'
import { showToast } from './toast.js'
import { flagIcon } from '../../lib/utils.js'

const STAGE_LABELS = {
  group: null,           // labelled by group letter
  semi:  'Semi-Finals',
  third: '3rd Place',
  final: 'Final',
}

const STAGE_ORDER = ['group', 'semi', 'third', 'final']

export function renderScoresSection(el, data) {
  el.innerHTML = ''
  el.style.cssText = 'margin-bottom:48px;'

  const title = document.createElement('h2')
  title.style.cssText =
    'font-family:var(--font-display);font-size:24px;letter-spacing:1.5px;color:var(--theme-heading-on-bg);text-transform:uppercase;margin-bottom:24px;'
  title.textContent = 'Match Scores'
  el.appendChild(title)

  const rerender = (updatedData) => renderScoresSection(el, updatedData)
  const bracket    = resolveBracket(data)
  const resolvedKO = { SF1: bracket.sf1, SF2: bracket.sf2, '3PL': bracket.third, FIN: bracket.final }
  const groups = groupFixtures(data.fixtures)

  for (const { label, fixtures } of groups) {
    const section = buildFixtureGroup(label, fixtures, data, rerender, resolvedKO)
    el.appendChild(section)
  }
}

function groupFixtures(fixtures) {
  const result = []
  for (const stage of STAGE_ORDER) {
    const fxs = fixtures.filter(f => f.stage === stage)
    if (!fxs.length) continue

    if (stage === 'group') {
      for (const group of ['A', 'B']) {
        const gfxs = fxs.filter(f => f.group === group)
        if (gfxs.length) result.push({ label: `Group ${group} Fixtures`, fixtures: gfxs })
      }
    } else {
      result.push({ label: STAGE_LABELS[stage], fixtures: fxs })
    }
  }
  return result
}

function buildFixtureGroup(label, fixtures, data, rerender, resolvedKO) {
  const wrap = document.createElement('div')
  wrap.style.cssText = 'margin-bottom:16px;background:var(--color-navy-mid);border-radius:8px;padding:12px 20px;'

  const heading = document.createElement('h3')
  heading.style.cssText =
    'font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--color-gold);padding-bottom:8px;border-bottom:1px solid rgba(212,165,116,0.3);margin-bottom:12px;'
  heading.textContent = label
  wrap.appendChild(heading)

  for (const fx of fixtures) {
    wrap.appendChild(buildFixtureRow(fx, data, rerender, resolvedKO))
  }
  return wrap
}

function resultColor(myScore, oppScore) {
  if (myScore === null || oppScore === null) return 'var(--color-text-light)'
  const m = Number(myScore), o = Number(oppScore)
  if (m > o) return 'var(--color-win)'
  if (m < o) return '#ff6b6b'
  return 'var(--color-text-light)'
}

function buildFixtureRow(fx, data, rerender, resolvedKO) {
  const resolved = resolvedKO?.[fx.id]
  const homeId   = resolved?.home ?? fx.home
  const awayId   = resolved?.away ?? fx.away
  const isTbd    = homeId === 'TBD' || awayId === 'TBD'
  const homeTeam = data.teams[homeId] ?? { name: 'TBD', flag: '—', short: 'TBD' }
  const awayTeam = data.teams[awayId] ?? { name: 'TBD', flag: '—', short: 'TBD' }

  const homeColor = resultColor(resolved?.homeScore ?? fx.homeScore, resolved?.awayScore ?? fx.awayScore)
  const awayColor = resultColor(resolved?.awayScore ?? fx.awayScore, resolved?.homeScore ?? fx.homeScore)

  const row = document.createElement('div')
  row.style.cssText =
    `display:grid;grid-template-columns:1fr auto auto auto 1fr;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(212,165,116,0.1);opacity:${isTbd ? '0.4' : '1'};`

  // Home team
  const homeCell = document.createElement('div')
  homeCell.style.cssText = `display:flex;align-items:center;gap:10px;font-family:var(--font-sans);font-size:16px;font-weight:600;color:${homeColor};`
  homeCell.innerHTML = `${flagIcon(homeId, homeTeam.flag)}<span>${escapeText(homeTeam.name)}</span>`

  // Score inputs — use resolved scores if available
  const dispHomeScore = resolved?.homeScore ?? fx.homeScore
  const dispAwayScore = resolved?.awayScore ?? fx.awayScore
  const homeScore = scoreInput(dispHomeScore, isTbd)
  const separator = document.createElement('span')
  separator.style.cssText = 'color:var(--color-text-muted);font-size:18px;'
  separator.textContent = '—'
  const awayScore = scoreInput(dispAwayScore, isTbd)

  // Away team
  const awayCell = document.createElement('div')
  awayCell.style.cssText = `display:flex;align-items:center;gap:10px;font-family:var(--font-sans);font-size:16px;font-weight:600;color:${awayColor};flex-direction:row-reverse;`
  awayCell.innerHTML = `${flagIcon(awayId, awayTeam.flag)}<span>${escapeText(awayTeam.name)}</span>`

  // Save button
  const saveBtn = document.createElement('button')
  saveBtn.disabled = isTbd
  saveBtn.style.cssText =
    `background:${isTbd ? 'var(--color-navy)' : 'var(--color-gold-bright)'};color:var(--color-navy-dark);border:none;padding:8px 14px;border-radius:4px;font-weight:700;font-size:11px;letter-spacing:1px;cursor:${isTbd ? 'default' : 'pointer'};text-transform:uppercase;white-space:nowrap;`
  saveBtn.textContent = 'Save'

  saveBtn.addEventListener('click', async () => {
    const hs = homeScore.value === '' ? null : Number(homeScore.value)
    const as = awayScore.value === '' ? null : Number(awayScore.value)
    if (hs === null || as === null) { showToast('Enter both scores before saving', 'error'); return }
    await saveFixtureScore(fx.id, hs, as, saveBtn, rerender)
  })

  row.appendChild(homeCell)
  row.appendChild(homeScore)
  row.appendChild(separator)
  row.appendChild(awayScore)
  row.appendChild(awayCell)

  // Save button in a trailing column — add as 6th column by adjusting grid
  row.style.gridTemplateColumns = '1fr auto auto auto 1fr auto'
  row.appendChild(saveBtn)

  return row
}

function scoreInput(value, disabled) {
  const input = document.createElement('input')
  input.type = 'number'
  input.min = '0'
  input.max = '99'
  input.value = value ?? ''
  input.disabled = disabled
  input.style.cssText =
    `width:52px;height:48px;box-sizing:border-box;background:var(--color-navy-dark);border:1px solid var(--color-gold-dark);border-radius:4px;padding:0 6px;color:var(--color-gold-bright);font-family:var(--font-display);font-size:22px;text-align:center;outline:none;-moz-appearance:textfield;`
  input.addEventListener('focus', () => { if (!disabled) input.style.borderColor = 'var(--color-gold-bright)' })
  input.addEventListener('blur',  () => { input.style.borderColor = 'var(--color-gold-dark)' })
  return input
}

async function saveFixtureScore(fixtureId, homeScore, awayScore, btn, rerender) {
  const pat = getPat()
  if (!pat) { showToast('Enter and save your GitHub PAT first', 'error'); return }

  const originalText = btn.textContent
  btn.textContent = '…'
  btn.disabled = true

  const { ok, sha, content, error: fetchErr } = await getFileMeta(pat)
  if (!ok) { showToast(`Read failed: ${fetchErr}`, 'error'); btn.textContent = originalText; btn.disabled = false; return }

  // For knockout fixtures still holding 'TBD', resolve real team IDs from the
  // bracket before writing so data.json stays self-consistent.
  const liveKO = resolveBracket(content)
  const liveKOMap = { SF1: liveKO.sf1, SF2: liveKO.sf2, '3PL': liveKO.third, FIN: liveKO.final }

  const updated = {
    ...content,
    fixtures: content.fixtures.map(fx => {
      if (fx.id !== fixtureId) return fx
      const r    = liveKOMap[fixtureId]
      const home = (fx.home === 'TBD' && r?.home && r.home !== 'TBD') ? r.home : fx.home
      const away = (fx.away === 'TBD' && r?.away && r.away !== 'TBD') ? r.away : fx.away
      return { ...fx, home, away, homeScore, awayScore }
    }),
  }

  const { ok: writeOk, error: writeErr } = await writeData(pat, updated, sha)
  if (!writeOk) { showToast(`Save failed: ${writeErr}`, 'error'); btn.textContent = originalText; btn.disabled = false; return }

  btn.textContent = '✓'
  btn.style.background = 'var(--color-success)'
  showToast('Score saved', 'success')
  setTimeout(() => {
    if (rerender) {
      rerender(updated)
    } else {
      btn.textContent = originalText
      btn.style.background = 'var(--color-gold-bright)'
      btn.disabled = false
    }
  }, 2000)
}

function escapeText(str) {
  const d = document.createElement('span')
  d.textContent = str
  return d.innerHTML
}

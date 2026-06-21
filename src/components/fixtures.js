import { gsap } from 'gsap'
import { resolveBracket } from '../lib/knockout.js'
import { escapeHtml, flagIcon } from '../lib/utils.js'

const STAGE_SECTIONS = [
  { stage: 'group', group: 'A', label: 'Group A' },
  { stage: 'group', group: 'B', label: 'Group B' },
  { stage: 'semi',  label: 'Semi-Finals' },
  { stage: 'third', label: '3rd Place Match' },
  { stage: 'final', label: 'Final' },
]

export function renderFixtures(el, data) {
  el.className = 'section'
  el.style.background = 'var(--color-cream)'

  const bracket   = resolveBracket(data)
  const resolvedKO = { SF1: bracket.sf1, SF2: bracket.sf2, '3PL': bracket.third, FIN: bracket.final }

  let html = `
    <div class="container">
      <div class="section-header">
        <div class="heading" style="font-family:var(--font-mono);color:var(--theme-heading-on-bg);">Fixtures &amp; Results</div>
        <div class="divider-star" style="color:var(--color-gold-dark);justify-content:center;max-width:300px;margin:8px auto 0;">★ ★ ★</div>
      </div>
  `

  for (const section of STAGE_SECTIONS) {
    const fxs = data.fixtures.filter(fx =>
      fx.stage === section.stage && (section.group ? fx.group === section.group : true)
    )
    if (!fxs.length) continue

    html += `<div class="fixtures-group" style="margin-bottom:32px;">`
    html += `<div style="font-family:var(--font-display);font-size:18px;letter-spacing:1.5px;color:var(--color-gold-dark);text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid rgba(26,46,90,0.2);margin-bottom:12px;">${section.label}</div>`
    for (const fx of fxs) {
      const r = resolvedKO[fx.id]
      const displayFx = r ? { ...fx, home: r.home, away: r.away, homeScore: r.homeScore, awayScore: r.awayScore } : fx
      html += buildMatchCard(displayFx, data)
    }
    html += `</div>`
  }

  html += `</div>`
  el.innerHTML = html

  // Scroll-triggered fade in
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const cards = entry.target.querySelectorAll('.match-card')
      gsap.from(cards, { opacity: 0, y: 16, duration: 0.4, stagger: 0.06, ease: 'power2.out', clearProps: 'all' })
      observer.unobserve(entry.target)
    })
  }, { threshold: 0.1 })

  el.querySelectorAll('.fixtures-group').forEach(g => observer.observe(g))
}

function resultColor(myScore, oppScore, played) {
  if (!played) return 'var(--color-text-light)'
  const m = Number(myScore), o = Number(oppScore)
  if (m > o) return 'var(--color-win)'
  if (m < o) return '#ff6b6b'
  return 'var(--color-text-light)'
}

function buildMatchCard(fx, data) {
  const isTbd    = fx.home === 'TBD' || fx.away === 'TBD'
  const played   = fx.homeScore !== null && fx.awayScore !== null
  const homeTeam = data.teams[fx.home] ?? { name: 'TBD', flag: '—', short: 'TBD' }
  const awayTeam = data.teams[fx.away] ?? { name: 'TBD', flag: '—', short: 'TBD' }

  const homeColor = resultColor(fx.homeScore, fx.awayScore, played)
  const awayColor = resultColor(fx.awayScore, fx.homeScore, played)

  const homeFlag = isTbd ? '' : flagIcon(fx.home, homeTeam.flag)
  const awayFlag = isTbd ? '' : flagIcon(fx.away, awayTeam.flag)

  const homeScore = played
    ? `<span class="match-card__score" style="color:${homeColor};">${Number(fx.homeScore)}</span>` : ''
  const awayScore = played
    ? `<span class="match-card__score" style="color:${awayColor};">${Number(fx.awayScore)}</span>` : ''

  const vsDivider = !played
    ? `<div style="text-align:center;color:var(--color-text-muted);font-size:11px;font-weight:700;letter-spacing:3px;padding:0 18px 2px;opacity:0.6;">VS</div>`
    : ''

  const badge = played
    ? `<span style="background:var(--color-navy);color:var(--color-gold);border:1px solid var(--color-gold-dark);padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Played</span>`
    : isTbd
      ? `<span style="color:var(--color-text-muted);font-size:10px;letter-spacing:1px;text-transform:uppercase;">TBD</span>`
      : `<span style="color:var(--color-text-muted);font-size:10px;letter-spacing:1px;text-transform:uppercase;">Upcoming</span>`

  const borderColor = played ? 'var(--color-gold)' : isTbd ? 'rgba(212,165,116,0.1)' : 'rgba(212,165,116,0.3)'

  return `
    <div class="match-card ${played ? 'match-card--played' : ''} ${isTbd ? 'match-card--tbd' : ''}" style="border-left-color:${borderColor};">
      <div class="match-card__row">
        ${homeFlag}
        <span class="match-card__name" style="color:${homeColor};">${escapeHtml(homeTeam.name)}</span>
        ${homeScore}
      </div>
      ${vsDivider}
      <div class="match-card__row" style="border-top:1px solid rgba(255,255,255,0.05);">
        ${awayFlag}
        <span class="match-card__name" style="color:${awayColor};">${escapeHtml(awayTeam.name)}</span>
        ${awayScore}
      </div>
      <div class="match-card__footer">${badge}</div>
    </div>
  `
}

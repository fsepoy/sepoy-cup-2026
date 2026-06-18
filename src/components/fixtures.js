import { gsap } from 'gsap'
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

  let html = `
    <div class="container">
      <div class="section-header">
        <div class="heading" style="color:var(--theme-heading-on-bg);">Fixtures &amp; Results</div>
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
    for (const fx of fxs) html += buildMatchCard(fx, data)
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

function buildMatchCard(fx, data) {
  const isTbd    = fx.home === 'TBD' || fx.away === 'TBD'
  const played   = fx.homeScore !== null && fx.awayScore !== null
  const homeTeam = data.teams[fx.home] ?? { name: 'TBD', flag: '—', short: 'TBD' }
  const awayTeam = data.teams[fx.away] ?? { name: 'TBD', flag: '—', short: 'TBD' }

  const borderColor = played ? 'var(--color-gold)' : isTbd ? 'transparent' : 'var(--color-navy)'
  const scoreHtml   = played
    ? `<span style="font-family:var(--font-display);font-size:28px;color:var(--color-gold-bright);min-width:80px;text-align:center;letter-spacing:2px;">${fx.homeScore} – ${fx.awayScore}</span>`
    : `<span style="font-size:14px;color:var(--color-text-muted);font-weight:600;min-width:80px;text-align:center;">vs</span>`

  const badge = played
    ? `<span style="background:var(--color-navy);color:var(--color-gold);border:1px solid var(--color-gold-dark);padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Played</span>`
    : isTbd
      ? `<span style="color:var(--color-text-muted);font-size:10px;letter-spacing:1px;text-transform:uppercase;">TBD</span>`
      : `<span style="color:var(--color-text-muted);font-size:10px;letter-spacing:1px;text-transform:uppercase;">Upcoming</span>`

  return `
    <div class="match-card" style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--color-navy-mid);border-radius:4px;margin-bottom:8px;border-left:3px solid ${borderColor};opacity:${isTbd ? '0.5' : '1'};">
      <div style="display:flex;align-items:center;gap:8px;flex:1;font-weight:600;color:var(--color-text-light);">
        ${flagIcon(fx.home, homeTeam.flag)}
        <span>${escapeHtml(homeTeam.name)}</span>
      </div>
      ${scoreHtml}
      <div style="display:flex;align-items:center;gap:8px;flex:1;font-weight:600;color:var(--color-text-light);flex-direction:row-reverse;">
        ${flagIcon(fx.away, awayTeam.flag)}
        <span>${escapeHtml(awayTeam.name)}</span>
      </div>
      <div style="min-width:70px;text-align:right;">${badge}</div>
    </div>
  `
}

import { gsap } from 'gsap'
import { resolveBracket } from '../lib/knockout.js'

export function renderBracket(el, data) {
  el.className = 'section section--navy'

  const bracket = resolveBracket(data)

  el.innerHTML = `
    <div class="container">
      <div class="section-header">
        <div class="heading" style="color:var(--color-gold-bright);">Knockout Bracket</div>
        <div class="divider-star" style="color:var(--color-gold);justify-content:center;max-width:300px;margin:8px auto 0;">★ ★ ★</div>
      </div>
      <div class="bracket-wrapper" style="overflow-x:auto;padding-bottom:24px;">
        ${buildBracketSVG(bracket, data)}
      </div>
      <div class="bracket-slots" style="display:flex;flex-direction:column;gap:48px;max-width:700px;margin:0 auto;">
        ${buildBracketCards(bracket, data)}
      </div>
    </div>
  `

  animateBracket(el)
}

function buildBracketCards(bracket, data) {
  const rounds = [
    { label: 'Semi-Finals', matches: [
        { label: 'SF1', match: bracket.sf1 },
        { label: 'SF2', match: bracket.sf2 },
      ]
    },
    { label: 'Third Place', matches: [{ label: '3rd Place', match: bracket.third }] },
    { label: 'Final',       matches: [{ label: 'Final',     match: bracket.final }] },
  ]

  return rounds.map(round => `
    <div class="bracket-round" style="display:flex;flex-direction:column;gap:16px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--color-gold);margin-bottom:4px;">${round.label}</div>
      ${round.matches.map(({ label, match }) => buildMatchBlock(label, match, data)).join('')}
    </div>
  `).join('')
}

function buildMatchBlock(label, match, data) {
  const homeTeam = data.teams[match.home]
  const awayTeam = data.teams[match.away]
  const played   = match.homeScore !== null && match.awayScore !== null
  const homeTbd  = match.home === 'TBD'
  const awayTbd  = match.away === 'TBD'

  const homeWin = played && Number(match.homeScore) >= Number(match.awayScore)
  const awayWin = played && !homeWin

  return `
    <div class="bracket-match" style="background:var(--color-navy-dark);border:2px solid var(--color-gold-dark);border-radius:8px;overflow:hidden;max-width:420px;">
      ${buildSlot(homeTeam, homeTbd, match.homeScore, homeWin, played)}
      <div style="height:1px;background:var(--color-gold-dark);opacity:0.4;"></div>
      ${buildSlot(awayTeam, awayTbd, match.awayScore, awayWin, played)}
    </div>
  `
}

function buildSlot(team, isTbd, score, isWinner, played) {
  const bg      = isWinner ? 'var(--color-navy)' : 'transparent'
  const color   = isTbd ? 'var(--color-text-muted)' : isWinner ? 'var(--color-gold-bright)' : 'var(--color-text-light)'
  const border  = isWinner ? 'border-left:3px solid var(--color-gold-bright);' : 'border-left:3px solid transparent;'
  const shadow  = isWinner ? 'box-shadow:var(--shadow-glow);' : ''

  return `
    <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:${bg};${border}${shadow}transition:all 0.2s;">
      <span style="font-size:22px;">${isTbd ? '—' : (team?.flag ?? '🏴')}</span>
      <span style="font-weight:600;color:${color};flex:1;">${isTbd ? 'TBD' : (team?.name ?? '?')}</span>
      ${played ? `<span style="font-family:var(--font-display);font-size:24px;color:${isWinner ? 'var(--color-gold-bright)' : 'var(--color-text-muted)'};">${score}</span>` : ''}
    </div>
  `
}

function buildBracketSVG() {
  // Minimal decorative SVG connector lines — actual bracket is in card form above
  return ''
}

function animateBracket(el) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const matches = entry.target.querySelectorAll('.bracket-match')
      gsap.from(matches, { opacity: 0, x: -20, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'all' })
      observer.unobserve(entry.target)
    })
  }, { threshold: 0.15 })

  observer.observe(el)
}

import { gsap } from 'gsap'
import { calculateStandings } from '../lib/standings.js'
import { escapeHtml, flagIcon } from '../lib/utils.js'

export function renderGroups(el, data) {
  el.className = 'section section--dark'
  el.innerHTML = `
    <div class="container">
      <div class="section-header">
        <div class="heading" style="font-family:var(--font-mono);color:var(--color-gold-bright);">Group Standings</div>
        <div class="divider-star" style="color:var(--color-gold);justify-content:center;max-width:300px;margin:8px auto 0;">★ ★ ★</div>
      </div>
      <div class="standings-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
        ${buildGroupCard('A', data)}
        ${buildGroupCard('B', data)}
      </div>
    </div>
  `

  // Animate rows in on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const rows = entry.target.querySelectorAll('tr[data-row]')
      gsap.from(rows, { x: -30, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', clearProps: 'all' })
      observer.unobserve(entry.target)
    })
  }, { threshold: 0.2 })

  el.querySelectorAll('.card').forEach(card => observer.observe(card))
}

function buildGroupCard(group, data) {
  const teamIds = data.groups[group]
  const rows    = calculateStandings(teamIds, data.fixtures, group)
  const played  = data.fixtures.some(fx => fx.stage === 'group' && fx.group === group && fx.homeScore !== null)

  return `
    <div class="card" style="background:var(--color-navy-mid);border:2px solid var(--color-gold);border-radius:8px;overflow:hidden;">
      <div class="card__header" style="background:var(--color-navy);padding:12px 16px;border-bottom:2px solid var(--color-gold);">
        <span style="font-family:var(--font-display);font-size:18px;letter-spacing:2px;color:var(--color-gold-bright);text-transform:uppercase;">Group ${escapeHtml(group)}</span>
        ${!played ? `<span style="font-size:11px;color:var(--color-text-muted);margin-left:10px;">No matches played yet</span>` : ''}
      </div>
      <table class="group-table" style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr>
            <th style="background:var(--color-navy);color:var(--color-gold);font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:8px 10px;text-align:left;border-bottom:2px solid var(--color-gold);" colspan="2">Team</th>
            ${['P','W','D','L','GF','GA','GD','Pts'].map(h =>
              `<th style="background:var(--color-navy);color:var(--color-gold);font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:8px 6px;text-align:center;border-bottom:2px solid var(--color-gold);">${h}</th>`
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row, i) => buildStandingRow(row, i, data.teams[row.teamId])).join('')}
        </tbody>
      </table>
    </div>
  `
}

function buildStandingRow(row, index, team) {
  const hasWon  = row.W > 0
  const hasLost = row.L > 0 && row.W === 0
  const hasDraw = row.D > 0 && row.W === 0 && row.L === 0
  const noGames = row.P === 0

  // Name / stats colour
  const nameColor = hasWon  ? 'var(--color-win)'
                  : hasLost ? '#ff6b6b'
                  : hasDraw ? 'var(--color-text-light)'
                  : 'var(--color-text-muted)'

  const statColor = hasWon  ? 'var(--color-win)'
                  : hasLost ? '#ff6b6b'
                  : 'var(--color-text-light)'

  // Row background tint for losers
  const rowBg = hasLost ? 'rgba(180,30,30,0.15)' : 'transparent'

  const advBadge = index < 2
    ? `<span style="display:inline-block;width:4px;height:14px;background:${hasWon ? 'var(--color-win)' : 'var(--color-gold-bright)'};border-radius:2px;margin-right:6px;vertical-align:middle;"></span>`
    : `<span style="display:inline-block;width:4px;height:14px;margin-right:6px;"></span>`

  const cells = [row.P, row.W, row.D, row.L, row.GF, row.GA, row.GD, row.Pts]
    .map(v => `<td style="padding:10px 6px;text-align:center;color:${statColor};font-weight:${hasWon ? '700' : '400'};border-bottom:1px solid rgba(212,165,116,0.08);">${v}</td>`)
    .join('')

  return `
    <tr data-row="${index}"
        style="background:${rowBg};transition:background 0.2s;"
        onmouseover="this.style.background='rgba(26,58,106,0.55)'"
        onmouseout="this.style.background='${rowBg}'">
      <td style="padding:10px 10px;color:var(--color-text-muted);font-size:11px;width:20px;border-bottom:1px solid rgba(212,165,116,0.08);">${index + 1}</td>
      <td style="padding:10px 10px;border-bottom:1px solid rgba(212,165,116,0.08);">
        ${advBadge}
        <span style="margin-right:8px;">${flagIcon(row.teamId, team?.flag)}</span>
        <span style="font-weight:${hasWon ? '700' : '400'};color:${nameColor};">${escapeHtml(team?.name ?? row.teamId)}</span>
      </td>
      ${cells}
    </tr>
  `
}

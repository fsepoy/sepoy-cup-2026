/**
 * Calculate group standings from fixtures.
 *
 * @param {string[]} teamIds  - ordered list of team IDs in the group
 * @param {object[]} fixtures - all tournament fixtures
 * @param {string}   group    - 'A' or 'B'
 * @returns {object[]} sorted standings rows
 */
export function calculateStandings(teamIds, fixtures, group) {
  const rows = Object.fromEntries(
    teamIds.map(id => [id, { teamId: id, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 }])
  )

  for (const fx of fixtures) {
    if (fx.stage !== 'group' || fx.group !== group) continue
    if (fx.homeScore === null || fx.awayScore === null) continue

    const h = rows[fx.home]
    const a = rows[fx.away]
    if (!h || !a) continue

    const hs = Number(fx.homeScore)
    const as = Number(fx.awayScore)

    h.P++; a.P++
    h.GF += hs; h.GA += as; h.GD += hs - as
    a.GF += as; a.GA += hs; a.GD += as - hs

    if (hs > as)      { h.W++; h.Pts += 3; a.L++ }
    else if (hs < as) { a.W++; a.Pts += 3; h.L++ }
    else              { h.D++; h.Pts++; a.D++; a.Pts++ }
  }

  return Object.values(rows).sort(compareRows)
}

/**
 * Sort comparator: Pts → GD → GF → alphabetical (tie-break match handled separately).
 */
function compareRows(a, b) {
  if (b.Pts !== a.Pts) return b.Pts - a.Pts
  if (b.GD  !== a.GD)  return b.GD  - a.GD
  if (b.GF  !== a.GF)  return b.GF  - a.GF
  return a.teamId.localeCompare(b.teamId)
}

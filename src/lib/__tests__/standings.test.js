import { describe, it, expect } from 'vitest'
import { calculateStandings } from '../standings.js'

const teams = ['croatia', 'belgium', 'germany']

function fixture(id, home, away, homeScore, awayScore) {
  return { id, stage: 'group', group: 'A', home, away, homeScore, awayScore }
}

describe('calculateStandings', () => {
  it('returns three rows with zeros when no matches played', () => {
    const rows = calculateStandings(teams, [], 'A')
    expect(rows).toHaveLength(3)
    expect(rows.every(r => r.Pts === 0)).toBe(true)
  })

  it('correctly awards 3pts for a win, 0 for a loss', () => {
    const fixtures = [fixture('GA1', 'croatia', 'belgium', 2, 0)]
    const rows = calculateStandings(teams, fixtures, 'A')
    const cro = rows.find(r => r.teamId === 'croatia')
    const bel = rows.find(r => r.teamId === 'belgium')
    expect(cro.Pts).toBe(3)
    expect(cro.W).toBe(1)
    expect(bel.Pts).toBe(0)
    expect(bel.L).toBe(1)
  })

  it('correctly awards 1pt each for a draw', () => {
    const fixtures = [fixture('GA1', 'croatia', 'belgium', 1, 1)]
    const rows = calculateStandings(teams, fixtures, 'A')
    const cro = rows.find(r => r.teamId === 'croatia')
    const bel = rows.find(r => r.teamId === 'belgium')
    expect(cro.Pts).toBe(1)
    expect(bel.Pts).toBe(1)
    expect(cro.D).toBe(1)
  })

  it('sorts by goal difference as tiebreaker when points equal', () => {
    const fixtures = [
      fixture('GA1', 'croatia', 'belgium', 1, 0),  // CRO 3pts GD+1
      fixture('GA2', 'croatia', 'germany', 0, 1),  // GER 3pts GD+1
      fixture('GA3', 'belgium', 'germany', 0, 0),  // BEL 1pt, GER 1pt
    ]
    // GER: 1W 1D 0L = 4pts, GD +1
    // CRO: 1W 0D 1L = 3pts, GD 0
    // BEL: 0W 1D 1L = 1pt,  GD -1
    const rows = calculateStandings(teams, fixtures, 'A')
    expect(rows[0].teamId).toBe('germany')
    expect(rows[1].teamId).toBe('croatia')
    expect(rows[2].teamId).toBe('belgium')
  })

  it('sorts by goals scored as second tiebreaker when pts and GD are equal', () => {
    const fixtures = [
      fixture('GA1', 'croatia', 'belgium', 3, 1),  // CRO 3pts GD+2 GF3
      fixture('GA2', 'germany', 'belgium', 2, 0),  // GER 3pts GD+2 GF2
      fixture('GA3', 'croatia', 'germany', 0, 0),  // draw
    ]
    // CRO: 1W 1D 0L = 4pts GD+2 GF3
    // GER: 1W 1D 0L = 4pts GD+2 GF2
    // BEL: 0W 0D 2L = 0pts
    const rows = calculateStandings(teams, fixtures, 'A')
    expect(rows[0].teamId).toBe('croatia')
    expect(rows[1].teamId).toBe('germany')
  })

  it('ignores fixtures from other groups and stages', () => {
    const fixtures = [
      { id: 'GB1', stage: 'group', group: 'B', home: 'england', away: 'france', homeScore: 2, awayScore: 1 },
      { id: 'SF1', stage: 'semi', home: 'croatia', away: 'england', homeScore: 1, awayScore: 0 },
    ]
    const rows = calculateStandings(teams, fixtures, 'A')
    expect(rows.every(r => r.Pts === 0)).toBe(true)
  })
})

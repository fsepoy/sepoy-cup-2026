import { describe, it, expect } from 'vitest'
import {
  isGroupStageComplete,
  isTournamentComplete,
  seedKnockout,
  getWinner,
  getLoser,
  resolveBracket,
} from '../knockout.js'

function makeData(groupFixtures = [], knockoutOverrides = {}) {
  const base = {
    groups: { A: ['croatia', 'belgium', 'germany'], B: ['england', 'france', 'argentina'] },
    teams: {
      croatia: {}, belgium: {}, germany: {},
      england: {}, france: {}, argentina: {},
    },
    fixtures: [
      { id: 'GA1', stage: 'group', group: 'A', home: 'croatia',   away: 'belgium',   ...groupFixtures[0] },
      { id: 'GA2', stage: 'group', group: 'A', home: 'croatia',   away: 'germany',   ...groupFixtures[1] },
      { id: 'GA3', stage: 'group', group: 'A', home: 'belgium',   away: 'germany',   ...groupFixtures[2] },
      { id: 'GB1', stage: 'group', group: 'B', home: 'england',   away: 'france',    ...groupFixtures[3] },
      { id: 'GB2', stage: 'group', group: 'B', home: 'england',   away: 'argentina', ...groupFixtures[4] },
      { id: 'GB3', stage: 'group', group: 'B', home: 'france',    away: 'argentina', ...groupFixtures[5] },
      { id: 'SF1', stage: 'semi',  home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },
      { id: 'SF2', stage: 'semi',  home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },
      { id: '3PL', stage: 'third', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },
      { id: 'FIN', stage: 'final', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },
      ...Object.entries(knockoutOverrides).map(([id, scores]) => ({ id, ...scores })),
    ],
  }
  return base
}

const played = [
  { homeScore: 2, awayScore: 0 },
  { homeScore: 1, awayScore: 1 },
  { homeScore: 0, awayScore: 2 },
  { homeScore: 3, awayScore: 1 },
  { homeScore: 2, awayScore: 0 },
  { homeScore: 1, awayScore: 2 },
]

describe('isGroupStageComplete', () => {
  it('returns false when fixtures have null scores', () => {
    const data = makeData([{ homeScore: null, awayScore: null }, ...Array(5).fill({ homeScore: null, awayScore: null })])
    expect(isGroupStageComplete(data.fixtures)).toBe(false)
  })

  it('returns true when all 6 group fixtures have scores', () => {
    const data = makeData(played)
    expect(isGroupStageComplete(data.fixtures)).toBe(true)
  })
})

describe('isTournamentComplete', () => {
  it('returns false when final has no score', () => {
    const data = makeData(played)
    expect(isTournamentComplete(data.fixtures)).toBe(false)
  })
})

describe('seedKnockout', () => {
  it('seeds SF1 as 1st Group A vs 2nd Group B', () => {
    const data = makeData(played)
    // Group A: GA1 croatia 2-0 belgium, GA2 croatia 1-1 germany, GA3 belgium 0-2 germany
    // CRO: 4pts, GER: 4pts (GD: CRO +2, GER +1) → CRO 1st, GER 2nd
    // Group B: GB1 england 3-1 france, GB2 england 2-0 argentina, GB3 france 1-2 argentina
    // ENG: 6pts 1st, ARG: 3pts 2nd, FRA: 0pts 3rd
    const seeds = seedKnockout(data)
    expect(seeds.sf1.home).toBe('croatia')
    expect(seeds.sf1.away).toBe('argentina')
    expect(seeds.sf2.home).toBe('england')
    expect(seeds.sf2.away).toBe('germany')
  })
})

describe('getWinner / getLoser', () => {
  it('returns home team when home score is higher', () => {
    const fx = { home: 'croatia', away: 'england', homeScore: 2, awayScore: 1 }
    expect(getWinner(fx)).toBe('croatia')
    expect(getLoser(fx)).toBe('england')
  })

  it('returns away team when away score is higher', () => {
    const fx = { home: 'croatia', away: 'england', homeScore: 0, awayScore: 3 }
    expect(getWinner(fx)).toBe('england')
    expect(getLoser(fx)).toBe('croatia')
  })

  it('returns home team on draw (home wins on penalties / ET)', () => {
    const fx = { home: 'croatia', away: 'england', homeScore: 1, awayScore: 1 }
    expect(getWinner(fx)).toBe('croatia')
  })

  it('returns null when score is missing', () => {
    const fx = { home: 'croatia', away: 'england', homeScore: null, awayScore: null }
    expect(getWinner(fx)).toBeNull()
  })
})

describe('resolveBracket', () => {
  it('returns all TBD slots when group stage is not complete', () => {
    const data = makeData(Array(6).fill({ homeScore: null, awayScore: null }))
    const bracket = resolveBracket(data)
    expect(bracket.sf1.home).toBe('TBD')
    expect(bracket.final.home).toBe('TBD')
  })

  it('resolves SF teams once group stage is complete', () => {
    const data = makeData(played)
    const bracket = resolveBracket(data)
    expect(bracket.sf1.home).toBe('croatia')
    expect(bracket.sf2.home).toBe('england')
  })

  it('resolves 3PL and Final teams once SF scores are present', () => {
    // seeds: SF1 = croatia (1A) vs argentina (2B), SF2 = england (1B) vs germany (2A)
    // SF1: croatia wins 2-1 → croatia to FIN, argentina to 3PL
    // SF2: germany wins 0-1 → germany to FIN, england to 3PL
    const data = {
      groups: { A: ['croatia', 'belgium', 'germany'], B: ['england', 'france', 'argentina'] },
      teams:  { croatia: {}, belgium: {}, germany: {}, england: {}, france: {}, argentina: {} },
      fixtures: [
        { id: 'GA1', stage: 'group', group: 'A', home: 'croatia',   away: 'belgium',   homeScore: 2, awayScore: 0 },
        { id: 'GA2', stage: 'group', group: 'A', home: 'croatia',   away: 'germany',   homeScore: 1, awayScore: 1 },
        { id: 'GA3', stage: 'group', group: 'A', home: 'belgium',   away: 'germany',   homeScore: 0, awayScore: 2 },
        { id: 'GB1', stage: 'group', group: 'B', home: 'england',   away: 'france',    homeScore: 3, awayScore: 1 },
        { id: 'GB2', stage: 'group', group: 'B', home: 'england',   away: 'argentina', homeScore: 2, awayScore: 0 },
        { id: 'GB3', stage: 'group', group: 'B', home: 'france',    away: 'argentina', homeScore: 1, awayScore: 2 },
        { id: 'SF1', stage: 'semi',  home: 'TBD', away: 'TBD', homeScore: 2, awayScore: 1 },
        { id: 'SF2', stage: 'semi',  home: 'TBD', away: 'TBD', homeScore: 0, awayScore: 1 },
        { id: '3PL', stage: 'third', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },
        { id: 'FIN', stage: 'final', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },
      ],
    }
    const bracket = resolveBracket(data)
    expect(bracket.sf1.home).toBe('croatia')
    expect(bracket.sf1.away).toBe('argentina')
    expect(bracket.sf2.home).toBe('england')
    expect(bracket.sf2.away).toBe('germany')
    expect(bracket.third.home).toBe('argentina') // loser of SF1
    expect(bracket.third.away).toBe('england')   // loser of SF2
    expect(bracket.final.home).toBe('croatia')   // winner of SF1
    expect(bracket.final.away).toBe('germany')   // winner of SF2
  })
})

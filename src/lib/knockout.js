import { calculateStandings } from './standings.js'

/**
 * Returns true when all group-stage fixtures have scores.
 */
export function isGroupStageComplete(fixtures) {
  return fixtures
    .filter(fx => fx.stage === 'group')
    .every(fx => fx.homeScore !== null && fx.awayScore !== null)
}

/**
 * Returns true when the whole tournament is complete.
 */
export function isTournamentComplete(fixtures) {
  const fin = fixtures.find(fx => fx.id === 'FIN')
  return fin?.homeScore !== null && fin?.awayScore !== null
}

/**
 * Derive semi-final seedings from group standings.
 * SF1: 1st Group A vs 2nd Group B
 * SF2: 1st Group B vs 2nd Group A
 *
 * @param {object} data - full tournament data object
 * @returns {{ sf1: {home, away}, sf2: {home, away} }}
 */
export function seedKnockout(data) {
  const standingsA = calculateStandings(data.groups.A, data.fixtures, 'A')
  const standingsB = calculateStandings(data.groups.B, data.fixtures, 'B')

  return {
    sf1: { home: standingsA[0].teamId, away: standingsB[1].teamId },
    sf2: { home: standingsB[0].teamId, away: standingsA[1].teamId },
  }
}

/**
 * Given a played fixture, return the winner's teamId.
 */
export function getWinner(fixture) {
  if (fixture.homeScore === null || fixture.awayScore === null) return null
  return Number(fixture.homeScore) >= Number(fixture.awayScore)
    ? fixture.home
    : fixture.away
}

/**
 * Given a played fixture, return the loser's teamId.
 */
export function getLoser(fixture) {
  if (fixture.homeScore === null || fixture.awayScore === null) return null
  return Number(fixture.homeScore) < Number(fixture.awayScore)
    ? fixture.home
    : fixture.away
}

/**
 * Build the current state of the knockout bracket from data.
 * Returns an object with resolved team IDs (or 'TBD') for each slot.
 */
export function resolveBracket(data) {
  const { fixtures } = data

  const sf1raw = fixtures.find(fx => fx.id === 'SF1')
  const sf2raw = fixtures.find(fx => fx.id === 'SF2')
  const tpl    = fixtures.find(fx => fx.id === '3PL')
  const fin    = fixtures.find(fx => fx.id === 'FIN')

  const groupDone = isGroupStageComplete(fixtures)
  const seedings  = groupDone ? seedKnockout(data) : null

  // Build resolved SF objects using seeded team IDs so getWinner/getLoser
  // can return actual teams (not 'TBD') when computing 3PL/FIN.
  const sf1 = sf1raw && {
    home:      seedings?.sf1.home ?? sf1raw.home,
    away:      seedings?.sf1.away ?? sf1raw.away,
    homeScore: sf1raw.homeScore,
    awayScore: sf1raw.awayScore,
  }
  const sf2 = sf2raw && {
    home:      seedings?.sf2.home ?? sf2raw.home,
    away:      seedings?.sf2.away ?? sf2raw.away,
    homeScore: sf2raw.homeScore,
    awayScore: sf2raw.awayScore,
  }

  return {
    sf1:   sf1 ?? { home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },
    sf2:   sf2 ?? { home: 'TBD', away: 'TBD', homeScore: null, awayScore: null },
    third: {
      home:      sf1 ? (getLoser(sf1)  ?? 'TBD') : 'TBD',
      away:      sf2 ? (getLoser(sf2)  ?? 'TBD') : 'TBD',
      homeScore: tpl?.homeScore ?? null,
      awayScore: tpl?.awayScore ?? null,
    },
    final: {
      home:      sf1 ? (getWinner(sf1) ?? 'TBD') : 'TBD',
      away:      sf2 ? (getWinner(sf2) ?? 'TBD') : 'TBD',
      homeScore: fin?.homeScore ?? null,
      awayScore: fin?.awayScore ?? null,
    },
  }
}

const OWNER = 'fsepoy'
const DATA_REPO = 'sepoy-cup-data'
const DATA_PATH = '2026/fc24/data.json'

export const DATA_URL =
  `https://raw.githubusercontent.com/${OWNER}/${DATA_REPO}/main/${DATA_PATH}`

/**
 * Fetch tournament data from the public GitHub data repo.
 * Returns { ok: true, data } or { ok: false, error }.
 */
export async function fetchTournamentData() {
  try {
    const res = await fetch(`${DATA_URL}?t=${Date.now()}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    const validation = validateData(json)
    if (!validation.valid) {
      return { ok: false, error: `Invalid data: ${validation.errors.join(', ')}` }
    }
    return { ok: true, data: json }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

/**
 * Validate the tournament data shape.
 * Returns { valid: boolean, errors: string[] }.
 */
export function validateData(json) {
  const errors = []
  if (!json || typeof json !== 'object') { errors.push('root must be object'); return { valid: false, errors } }
  if (!json.meta)     errors.push('missing meta')
  if (!json.groups)   errors.push('missing groups')
  if (!json.teams)    errors.push('missing teams')
  if (!Array.isArray(json.fixtures)) errors.push('fixtures must be array')
  return { valid: errors.length === 0, errors }
}

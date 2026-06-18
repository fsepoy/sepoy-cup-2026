import { describe, it, expect } from 'vitest'
import { validateData } from '../data.js'

describe('validateData', () => {
  it('returns valid for a correct data object', () => {
    const data = {
      meta: { name: 'Sepoy Cup' },
      groups: { A: [], B: [] },
      teams: {},
      fixtures: [],
    }
    expect(validateData(data).valid).toBe(true)
  })

  it('returns invalid for null', () => {
    expect(validateData(null).valid).toBe(false)
  })

  it('returns errors for each missing required field', () => {
    const result = validateData({ fixtures: [] })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('meta'))).toBe(true)
    expect(result.errors.some(e => e.includes('groups'))).toBe(true)
  })

  it('returns error when fixtures is not an array', () => {
    const result = validateData({ meta: {}, groups: {}, teams: {}, fixtures: null })
    expect(result.errors.some(e => e.includes('fixtures'))).toBe(true)
  })
})

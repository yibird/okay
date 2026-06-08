import { describe, expect, it } from 'vitest'
import { formatCompactNumber } from './formatCompactNumber'

describe('formatCompactNumber', () => {
  it('should format numbers with compact notation', () => {
    expect(formatCompactNumber(1200, { locale: 'en-US' })).toBe('1.2K')
  })

  it('should support compact display options', () => {
    expect(
      formatCompactNumber(1200, {
        compactDisplay: 'long',
        locale: 'en-US',
      }),
    ).toBe('1.2 thousand')
  })

  it('should return fallback for nullish values', () => {
    expect(formatCompactNumber(undefined, { fallback: '-' })).toBe('-')
  })
})

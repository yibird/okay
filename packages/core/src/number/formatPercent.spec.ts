import { describe, expect, it } from 'vitest'
import { formatPercent } from './formatPercent'

describe('formatPercent', () => {
  it('should format ratio values as percent by default', () => {
    expect(
      formatPercent(0.125, {
        locale: 'en-US',
        maximumFractionDigits: 1,
      }),
    ).toBe('12.5%')
  })

  it('should format already-percent values when valueMode is percent', () => {
    expect(
      formatPercent(12.5, {
        locale: 'en-US',
        maximumFractionDigits: 1,
        valueMode: 'percent',
      }),
    ).toBe('12.5%')
  })

  it('should return fallback for nullish values', () => {
    expect(formatPercent(null, { fallback: '-' })).toBe('-')
    expect(formatPercent(undefined, { fallback: 'N/A' })).toBe('N/A')
  })

  it('should return fallback for non-finite values by default', () => {
    expect(formatPercent(Number.NaN, { fallback: '-' })).toBe('-')
  })
})

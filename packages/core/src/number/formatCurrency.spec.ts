import { describe, expect, it } from 'vitest'
import { formatCurrency } from './formatCurrency'

describe('formatCurrency', () => {
  it('should format currency with option object', () => {
    expect(
      formatCurrency(1234.5, {
        currency: 'USD',
        locale: 'en-US',
      }),
    ).toBe('$1,234.50')
  })

  it('should format currency with shorthand currency argument', () => {
    expect(
      formatCurrency(1234, 'USD', {
        locale: 'en-US',
        maximumFractionDigits: 0,
      }),
    ).toBe('$1,234')
  })

  it('should default to USD', () => {
    expect(formatCurrency(12, { locale: 'en-US' })).toBe('$12.00')
  })

  it('should support currency display options', () => {
    expect(
      formatCurrency(12, {
        currency: 'USD',
        currencyDisplay: 'code',
        locale: 'en-US',
      }),
    ).toMatch(/^USD\s12\.00$/u)
  })

  it('should return fallback for nullish and non-finite values', () => {
    expect(formatCurrency(null, 'USD', { fallback: '-' })).toBe('-')
    expect(formatCurrency(Number.NaN, 'USD', { fallback: '-' })).toBe('-')
  })
})

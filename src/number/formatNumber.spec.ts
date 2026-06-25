import { describe, expect, it } from 'vitest'
import { formatNumber } from './formatNumber'
import { clearNumberFormatCache, getCachedNumberFormatter } from './numberFormatShared'

describe('formatNumber', () => {
  it('should format decimal numbers with locale options', () => {
    expect(
      formatNumber(1234.567, {
        locale: 'en-US',
        maximumFractionDigits: 2,
      }),
    ).toBe('1,234.57')
  })

  it('should format bigint values', () => {
    expect(formatNumber(12345678901234567890n, { locale: 'en-US' })).toBe(
      '12,345,678,901,234,567,890',
    )
  })

  it('should return fallback for nullish values', () => {
    expect(formatNumber(null, { fallback: '-' })).toBe('-')
    expect(formatNumber(undefined, { fallback: 'N/A' })).toBe('N/A')
  })

  it('should return fallback for non-finite values by default', () => {
    expect(formatNumber(Number.NaN, { fallback: '-' })).toBe('-')
    expect(formatNumber(Infinity, { fallback: '-' })).toBe('-')
  })

  it('should format non-finite values when allowed', () => {
    expect(formatNumber(Infinity, { allowNonFinite: true, locale: 'en-US' })).toBe(
      new Intl.NumberFormat('en-US').format(Infinity),
    )
  })

  it('should support sign and fraction options', () => {
    expect(
      formatNumber(12, {
        locale: 'en-US',
        minimumFractionDigits: 2,
        signDisplay: 'always',
      }),
    ).toBe('+12.00')
  })

  it('should include unknown option keys when building formatter cache keys', () => {
    const customOption = {
      toJSON: () => undefined,
    }

    expect(() =>
      getCachedNumberFormatter('en-US', {
        customOption,
      } as Intl.NumberFormatOptions),
    ).not.toThrow()
  })

  it('should support locale arrays in formatter cache keys', () => {
    expect(getCachedNumberFormatter(['en-US', 'fr'], {}).format(1234)).toBe('1,234')
  })

  it('should evict oldest formatter cache entry when full', () => {
    clearNumberFormatCache()

    for (let index = 0; index < 129; index++) {
      getCachedNumberFormatter('en-US', {
        maximumFractionDigits: index % 20,
        minimumIntegerDigits: (index % 21) + 1,
      })
    }

    expect(formatNumber(1, { locale: 'en-US' })).toBe('1')
  })
})

import { describe, expect, it, vi } from 'vitest'
import { createNumberFormatter } from './createNumberFormatter'
import { clearNumberFormatCache, getCachedNumberFormatter } from './numberFormatShared'

describe('createNumberFormatter', () => {
  it('should create a reusable formatter', () => {
    const formatter = createNumberFormatter({ locale: 'en-US', maximumFractionDigits: 1 })
    expect(formatter(1.25)).toBe('1.3')
    expect(formatter(null)).toBe('')
  })

  it('should apply fallback and non-finite behavior', () => {
    const formatter = createNumberFormatter({ fallback: '-', locale: 'en-US' })
    expect(formatter(Number.NaN)).toBe('-')
  })

  it('should reuse cached Intl.NumberFormat instances for equivalent options', () => {
    clearNumberFormatCache()
    const spy = vi.spyOn(Intl, 'NumberFormat')
    createNumberFormatter({ locale: 'en-US', maximumFractionDigits: 2 })
    createNumberFormatter({ locale: 'en-US', maximumFractionDigits: 2 })
    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
    clearNumberFormatCache()
  })

  it('handles bigint values', () => {
    const formatter = createNumberFormatter({ locale: 'en-US' })
    expect(formatter(1000n)).toBe('1,000')
  })

  it('returns fallback for non-number non-bigint values', () => {
    const formatter = createNumberFormatter({ fallback: 'N/A' })
    expect(formatter('not a number' as any)).toBe('N/A')
  })

  it('handles extra unknown option keys in cache key', () => {
    clearNumberFormatCache()
    const spy = vi.spyOn(Intl, 'NumberFormat')
    getCachedNumberFormatter('en-US', { style: 'decimal', unknownOption: true } as any)
    getCachedNumberFormatter('en-US', { style: 'decimal', unknownOption: true } as any)
    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
    clearNumberFormatCache()
  })

  it('evicts oldest entry when cache is full', () => {
    clearNumberFormatCache()
    // Fill cache to max (128) with unique but valid locales via notation option
    for (let i = 0; i < 128; i++) {
      getCachedNumberFormatter('en-US', { minimumFractionDigits: i % 4 })
    }
    // One more should evict the oldest without throwing
    expect(() => getCachedNumberFormatter('en-US', { minimumFractionDigits: 4 })).not.toThrow()
    clearNumberFormatCache()
  })
})

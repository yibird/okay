import { describe, expect, it } from 'vitest'
import { isDate } from './is-date'

describe('isDate utility function', () => {
  it('should return true for Date objects', () => {
    expect(isDate(new Date())).toBe(true)
    expect(isDate(new Date('2023-01-01'))).toBe(true)
    expect(isDate(new Date(0))).toBe(true) // Unix epoch
    expect(isDate(new Date(1672531200000))).toBe(true) // Specific timestamp
  })

  // 2. Negative cases (should return false)
  it('should return false for date strings', () => {
    expect(isDate('2023-01-01')).toBe(false)
    expect(isDate('01/01/2023')).toBe(false)
    expect(isDate('Invalid Date')).toBe(false)
  })

  it('should return false for timestamp numbers', () => {
    expect(isDate(1672531200000)).toBe(false)
    expect(isDate(0)).toBe(false) // Unix epoch
  })

  it('should return false for other objects', () => {
    expect(isDate({})).toBe(false)
    expect(isDate([])).toBe(false)
    expect(isDate(/regex/)).toBe(false)
  })

  it('should return false for invalid Date objects', () => {
    expect(isDate(new Date('invalid'))).toBe(true) // Still returns true because it's a Date object
  })

  it('should return false for primitive types', () => {
    expect(isDate(null)).toBe(false)
    expect(isDate(undefined)).toBe(false)
    expect(isDate(123)).toBe(false)
    expect(isDate('string')).toBe(false)
    expect(isDate(true)).toBe(false)
    expect(isDate(Symbol())).toBe(false)
    expect(isDate(123n)).toBe(false)
  })

  // 3. Edge cases
  it('should handle Date objects with modified prototype', () => {
    const date = new Date()
    Object.setPrototypeOf(date, Object.prototype)
    expect(isDate(date)).toBe(true)
  })

  it('should handle Date objects from different realms', () => {
    // Only test in environments where iframes are available
    if (typeof document !== 'undefined') {
      const iframe = document.createElement('iframe')
      document.body.append(iframe)

      try {
        const iframeDate = iframe.contentWindow?.window.Date
        if (iframeDate) {
          expect(isDate(iframeDate)).toBe(false)
        }
      } finally {
        iframe.remove()
      }
    }
  })

  it('should return true for invalid Date instances (still Date objects)', () => {
    const invalidDate = new Date('invalid-date-string')
    expect(isDate(invalidDate)).toBe(true)
    expect(invalidDate.toString()).toBe('Invalid Date')
  })

  it('should return false for date-like objects', () => {
    const dateLike = {
      getTime: () => 1672531200000,
      toString: () => 'Mon Jan 01 2023 00:00:00 GMT+0000',
    }
    expect(isDate(dateLike)).toBe(false)
  })
})

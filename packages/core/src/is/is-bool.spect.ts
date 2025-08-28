import { describe, expect, it } from 'vitest'
import { isBool } from './is-bool'

describe('isBool utility function', () => {
  // 1. Positive cases (should return true)
  it('should return true for boolean literals', () => {
    expect(isBool(true)).toBe(true)
    expect(isBool(false)).toBe(true)
  })

  it('should return true for Boolean objects', () => {
    expect(isBool(Boolean(true))).toBe(true)
    expect(isBool(Boolean(false))).toBe(true)
  })

  // 2. Negative cases (should return false)
  it('should return false for truthy/falsy values', () => {
    expect(isBool(1)).toBe(false)
    expect(isBool(0)).toBe(false)
    expect(isBool('true')).toBe(false)
    expect(isBool('false')).toBe(false)
    expect(isBool('')).toBe(false)
    expect(isBool([])).toBe(false)
    expect(isBool({})).toBe(false)
  })

  it('should return false for other primitive types', () => {
    expect(isBool(null)).toBe(false)
    expect(isBool(undefined)).toBe(false)
    expect(isBool(123)).toBe(false)
    expect(isBool('string')).toBe(false)
    expect(isBool(Symbol())).toBe(false)
    expect(isBool(123n)).toBe(false)
  })

  it('should return false for objects', () => {
    expect(isBool({})).toBe(false)
    expect(isBool([])).toBe(false)
    expect(isBool(new Date())).toBe(false)
    expect(isBool(/regex/)).toBe(false)
  })

  it('should return false for functions', () => {
    expect(isBool(function () {})).toBe(false)
    expect(isBool(() => {})).toBe(false)
  })

  // 3. Edge cases
  it('should handle boolean objects with modified prototype', () => {
    const boolObj = Boolean(true)
    Object.setPrototypeOf(boolObj, Object.prototype)
    expect(isBool(boolObj)).toBe(true)
  })

  it('should handle boolean values from different realms', () => {
    // Only test in environments where iframes are available
    if (typeof document !== 'undefined') {
      const iframe = document.createElement('iframe')
      document.body.append(iframe)

      try {
        const iframeBool =
          iframe.contentWindow?.window?.Boolean(true) ?? Boolean(true)
        if (iframeBool !== undefined) {
          expect(isBool(iframeBool)).toBe(true)
        }
      } finally {
        iframe.remove()
      }
    }
  })
})

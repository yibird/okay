import { describe, expect, it } from 'vitest'
import { isBigint } from './is-bigint'

describe('isBigint utility function', () => {
  // 1. Positive cases (should return true)
  it('should return true for BigInt literals', () => {
    expect(isBigint(123n)).toBe(true)
    expect(isBigint(0n)).toBe(true)
    expect(isBigint(-456n)).toBe(true)
    expect(isBigint(BigInt(9007199254740991))).toBe(true)
  })

  // 2. Negative cases (should return false)
  it('should return false for regular numbers', () => {
    expect(isBigint(123 as any)).toBe(false)
    expect(isBigint(0 as any)).toBe(false)
    expect(isBigint(-456 as any)).toBe(false)
    expect(isBigint(3.14 as any)).toBe(false)
    expect(isBigint(Number.NaN as any)).toBe(false)
    expect(isBigint(Infinity as any)).toBe(false)
  })

  it('should return false for other primitive types', () => {
    expect(isBigint('123n' as any)).toBe(false)
    expect(isBigint(true as any)).toBe(false)
    expect(isBigint(null as any)).toBe(false)
    expect(isBigint(undefined as any)).toBe(false)
    expect(isBigint(Symbol('test') as any)).toBe(false)
  })

  it('should return false for objects', () => {
    expect(isBigint({} as any)).toBe(false)
    expect(isBigint([] as any)).toBe(false)
    expect(isBigint(new Date() as any)).toBe(false)
    expect(isBigint(/regex/ as any)).toBe(false)
  })

  it('should return false for functions', () => {
    expect(isBigint(function () {} as any)).toBe(false)
    expect(isBigint((() => {}) as any)).toBe(false)
  })

  // 3. Edge cases
  it('should return false for BigInt wrapper objects', () => {
    // Note: There is no BigInt constructor in JavaScript
    // This test is for completeness in case someone tries to create one
    const fakeBigIntWrapper = { valueOf: () => 123n }
    expect(isBigint(fakeBigIntWrapper as any)).toBe(false)
  })

  it('should handle BigInt from different realms (if available)', () => {
    // Only test in environments where iframes are available
    if (typeof document !== 'undefined') {
      const iframe = document.createElement('iframe')
      document.body.append(iframe)

      try {
        const iframeBigInt = iframe.contentWindow?.window?.eval('BigInt(123)')
        if (iframeBigInt !== undefined) {
          expect(isBigint(iframeBigInt)).toBe(true)
        }
      } finally {
        iframe.remove()
      }
    }
  })
})

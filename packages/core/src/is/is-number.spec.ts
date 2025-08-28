import { describe, expect, it } from 'vitest'
import { isNumber } from './is-number'

describe('isNumber', () => {
  it('should return true for number values', () => {
    // Primitive numbers
    expect(isNumber(42)).toBe(true)
    expect(isNumber(0)).toBe(true)
    expect(isNumber(-3.14)).toBe(true)
    expect(isNumber(Infinity)).toBe(true)
    expect(isNumber(-Infinity)).toBe(true)
    expect(isNumber(Number.NaN)).toBe(true) // Note: NaN is technically a number

    // Number objects
    expect(isNumber(Number(42))).toBe(true)
    expect(isNumber(Number(-1))).toBe(true)
  })

  it('should return false for non-number values', () => {
    // Primitives
    expect(isNumber(undefined)).toBe(false)
    expect(isNumber(null)).toBe(false)
    expect(isNumber('42')).toBe(false)
    expect(isNumber(true)).toBe(false)
    expect(isNumber(false)).toBe(false)
    expect(isNumber(Symbol('symbol'))).toBe(false)
    expect(isNumber(BigInt(42))).toBe(false)

    // Objects
    expect(isNumber({})).toBe(false)
    expect(isNumber([])).toBe(false)
    expect(isNumber(new Date())).toBe(false)
    expect(isNumber(/regex/)).toBe(false)

    // Special cases
    expect(isNumber('')).toBe(false)
    expect(isNumber('number')).toBe(false)
    expect(isNumber([1, 2, 3])).toBe(false)
    expect(isNumber({ valueOf: () => 42 })).toBe(false)
  })

  it('should properly type guard when used with TypeScript', () => {
    const value: unknown = 3.14159

    if (isNumber(value)) {
      // Should now be recognized as number
      expect(value.toFixed(2)).toBe('3.14')
    } else {
      expect.fail('Type guard failed')
    }
  })

  it('should handle edge cases', () => {
    // Number-like values
    expect(isNumber('123')).toBe(false)
    expect(isNumber('123.45')).toBe(false)
    expect(isNumber('0x10')).toBe(false)

    // Boxed primitives that aren't numbers
    expect(isNumber(String('42'))).toBe(false)
    expect(isNumber(Boolean(true))).toBe(false)

    // Extreme values
    expect(isNumber(Number.MAX_VALUE)).toBe(true)
    expect(isNumber(Number.MIN_VALUE)).toBe(true)
    expect(isNumber(Number.EPSILON)).toBe(true)
  })
})

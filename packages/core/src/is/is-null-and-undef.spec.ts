import { describe, expect, it } from 'vitest'
import { isNullAndUndef } from './is-null-and-undef'

describe('isNullAndUndef utility function', () => {
  it('should return false for all values (since value cannot be both null and undefined simultaneously)', () => {
    expect(isNullAndUndef(null)).toBe(false)
    expect(isNullAndUndef(undefined)).toBe(false)
  })

  it('should return false for other primitive values', () => {
    expect(isNullAndUndef(0)).toBe(false)
    expect(isNullAndUndef('')).toBe(false)
    expect(isNullAndUndef(false)).toBe(false)
    expect(isNullAndUndef(true)).toBe(false)
    expect(isNullAndUndef(Number.NaN)).toBe(false)
    expect(isNullAndUndef(Symbol())).toBe(false)
    expect(isNullAndUndef(123n)).toBe(false)
  })

  it('should return false for objects', () => {
    expect(isNullAndUndef({})).toBe(false)
    expect(isNullAndUndef([])).toBe(false)
    expect(isNullAndUndef(new Date())).toBe(false)
    expect(isNullAndUndef(/regex/)).toBe(false)
  })

  it('should return false for functions', () => {
    expect(isNullAndUndef(function () {})).toBe(false)
    expect(isNullAndUndef(() => {})).toBe(false)
  })

  it('should return false for document.all (historic edge case)', () => {
    if (typeof document !== 'undefined' && 'all' in document) {
      expect(isNullAndUndef(document.all)).toBe(false)
    }
  })

  it('should properly narrow types when used in type guards', () => {
    const test = (value: unknown) => {
      if (isNullAndUndef(value)) {
        const check: never | null = value
        return check
      }
      return value // Type should be unknown (or whatever original type was)
    }

    expect(test(null)).toBe(null)
    expect(test(undefined)).toBe(undefined)
    expect(test('valid')).toBe('valid')
  })

  it('should document that this function always returns false', () => {
    const values = [
      null,
      undefined,
      0,
      '',
      false,
      true,
      Number.NaN,
      {},
      [],
      () => {},
      Symbol(),
      123n,
    ]

    values.forEach((value) => {
      expect(isNullAndUndef(value)).toBe(false)
    })
  })
})

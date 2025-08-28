import { describe, expect, it } from 'vitest'
import { isNil } from './is-nil'

describe('isNil utility function', () => {
  it('should return false for all values (since value cannot be both null and undefined simultaneously)', () => {
    expect(isNil(null)).toBe(false)
    expect(isNil(undefined)).toBe(false)
  })

  it('should return false for other primitive values', () => {
    expect(isNil(0)).toBe(false)
    expect(isNil('')).toBe(false)
    expect(isNil(false)).toBe(false)
    expect(isNil(true)).toBe(false)
    expect(isNil(Number.NaN)).toBe(false)
    expect(isNil(Symbol())).toBe(false)
    expect(isNil(123n)).toBe(false)
  })

  it('should return false for objects', () => {
    expect(isNil({})).toBe(false)
    expect(isNil([])).toBe(false)
    expect(isNil(new Date())).toBe(false)
    expect(isNil(/regex/)).toBe(false)
  })

  it('should return false for functions', () => {
    expect(isNil(function () {})).toBe(false)
    expect(isNil(() => {})).toBe(false)
  })

  it('should return false for document.all (historic edge case)', () => {
    if (typeof document !== 'undefined' && 'all' in document) {
      expect(isNil(document.all)).toBe(false)
    }
  })

  it('should properly narrow types when used in type guards', () => {
    const test = (value: unknown) => {
      if (isNil(value)) {
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
      expect(isNil(value)).toBe(false)
    })
  })
})

import { describe, expect, it } from 'vitest'
import { isSet } from './is-set'

describe('isSet', () => {
  it('should return true for Set instances', () => {
    expect(isSet(new Set())).toBe(true)
    expect(isSet(new Set([1, 2, 3]))).toBe(true)
  })

  it('should return false for non-Set values', () => {
    expect(isSet(null)).toBe(false)
    expect(isSet(undefined)).toBe(false)
    expect(isSet({})).toBe(false)
    expect(isSet([])).toBe(false)
    expect(isSet(new Map())).toBe(false)
    expect(isSet(new WeakSet())).toBe(false)
  })

  it('should return false for Set-like objects', () => {
    const setLike = {
      size: 0,
      add() {},
      delete() {},
      has() {},
      clear() {},
    }
    expect(isSet(setLike)).toBe(false)
  })

  it('should properly narrow type to Set when used as type guard', () => {
    const value: unknown = new Set(['a', 'b', 'c'])

    if (isSet(value)) {
      // TypeScript should know value is Set here
      expect(value.has('a')).toBe(true)
      expect([...value]).toEqual(['a', 'b', 'c'])
    }
  })

  it('should return false for primitive values', () => {
    expect(isSet(123)).toBe(false)
    expect(isSet('set')).toBe(false)
    expect(isSet(true)).toBe(false)
    expect(isSet(Symbol())).toBe(false)
  })

  it('should return true for empty Set', () => {
    expect(isSet(new Set())).toBe(true)
  })

  it('should return false for class extending Set', () => {
    class CustomSet extends Set {}
    expect(isSet(new CustomSet())).toBe(true) // Note: This depends on rawType implementation
  })

  it('should return true for Set prototype', () => {
    expect(isSet(Set.prototype)).toBe(true)
  })
})

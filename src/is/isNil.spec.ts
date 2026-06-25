import { describe, expect, it } from 'vitest'
import { isNil } from './isNil'

describe('isNil', () => {
  it('should return true for null or undefined', () => {
    expect(isNil(null)).toBe(true)
    expect(isNil(undefined)).toBe(true)
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

  it('should return false for objects and functions', () => {
    expect(isNil({})).toBe(false)
    expect(isNil([])).toBe(false)
    expect(isNil(new Date())).toBe(false)
    expect(isNil(/regex/)).toBe(false)
    expect(isNil(() => {})).toBe(false)
  })

  it('should narrow nullish values when used as a type guard', () => {
    const value: string | null | undefined = Math.random() > 0.5 ? 'valid' : null

    if (isNil(value)) {
      expect(value === null || value === undefined).toBe(true)
    } else {
      expect(value.toUpperCase()).toBe('VALID')
    }
  })
})

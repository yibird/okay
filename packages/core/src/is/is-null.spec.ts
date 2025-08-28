import { describe, expect, it } from 'vitest'
import { isNull } from './is-null'

describe('isNull', () => {
  it('should return true for null', () => {
    expect(isNull(null)).toBe(true)
  })

  it('should return false for undefined', () => {
    expect(isNull(undefined)).toBe(false)
  })

  it('should return false for primitive values', () => {
    expect(isNull(0)).toBe(false)
    expect(isNull('')).toBe(false)
    expect(isNull(false)).toBe(false)
    expect(isNull(Number.NaN)).toBe(false)
    expect(isNull(Symbol())).toBe(false)
    expect(isNull(10n)).toBe(false)
  })

  it('should return false for objects', () => {
    expect(isNull({})).toBe(false)
    expect(isNull([])).toBe(false)
    expect(isNull(new Date())).toBe(false)
  })

  it('should return false for functions', () => {
    expect(isNull(() => {})).toBe(false)
    expect(isNull(function () {})).toBe(false)
  })

  it('should properly narrow type to null when used as type guard', () => {
    const value: unknown = Math.random() > 0.5 ? null : 'test'

    if (isNull(value)) {
      // Inside this block, TypeScript should know value is null
      expect(value).toBeNull()
    } else {
      expect(value).not.toBeNull()
    }
  })

  it('should return false for empty objects and arrays', () => {
    expect(isNull({})).toBe(false)
    expect(isNull([])).toBe(false)
  })

  it('should return false for falsy non-null values', () => {
    expect(isNull(0)).toBe(false)
    expect(isNull('')).toBe(false)
    expect(isNull(false)).toBe(false)
  })

  it('should return false for special objects', () => {
    expect(isNull(new Map())).toBe(false)
    expect(isNull(new Set())).toBe(false)
    expect(isNull(/regex/)).toBe(false)
  })
})

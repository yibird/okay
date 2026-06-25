import { describe, expect, it } from 'vitest'
import { isUndefined } from './isUndef'

describe('isUndefined', () => {
  it('should return true for undefined', () => {
    expect(isUndefined(undefined)).toBe(true)
  })

  it('should return false for null', () => {
    expect(isUndefined(null)).toBe(false)
  })

  it('should return false for primitive values', () => {
    expect(isUndefined(0)).toBe(false)
    expect(isUndefined('')).toBe(false)
    expect(isUndefined(false)).toBe(false)
    expect(isUndefined(Number.NaN)).toBe(false)
  })

  it('should return false for objects', () => {
    expect(isUndefined({})).toBe(false)
    expect(isUndefined([])).toBe(false)
    expect(isUndefined(new Date())).toBe(false)
  })

  it('should return false for functions', () => {
    expect(isUndefined(() => {})).toBe(false)
  })

  it('should return false for Symbol', () => {
    expect(isUndefined(Symbol())).toBe(false)
  })

  it('should correctly narrow the type when used as type guard', () => {
    const testValue: string | undefined = Math.random() > 0.5 ? 'test' : undefined

    if (isUndefined(testValue)) {
      // Inside this block, TypeScript should know testValue is undefined
      expect(testValue).toBeUndefined()
    } else {
      // Inside this block, TypeScript should know testValue is string
      expect(typeof testValue).toBe('string')
    }
  })

  it('should work with generic types', () => {
    interface TestType {
      prop: number
    }

    const testValue: TestType | undefined = Math.random() > 0.5 ? { prop: 1 } : undefined

    if (isUndefined(testValue)) {
      expect(testValue).toBeUndefined()
    } else {
      expect(testValue).toHaveProperty('prop')
    }
  })

  it('should return true when no argument is passed', () => {
    expect(isUndefined()).toBe(true)
  })
})

import { describe, expect, it } from 'vitest'
import { isDef } from './is-def'

describe('isDef', () => {
  it('should return false for undefined', () => {
    expect(isDef(undefined)).toBe(false)
  })

  it('should return true for null', () => {
    expect(isDef(null)).toBe(true)
  })

  it('should return true for primitive values', () => {
    expect(isDef(0)).toBe(true)
    expect(isDef('')).toBe(true)
    expect(isDef(false)).toBe(true)
    expect(isDef(Number.NaN)).toBe(true)
  })

  it('should return true for objects', () => {
    expect(isDef({})).toBe(true)
    expect(isDef([])).toBe(true)
    expect(isDef(new Date())).toBe(true)
  })

  it('should return true for functions', () => {
    expect(isDef(() => {})).toBe(true)
    expect(isDef(function () {})).toBe(true)
  })

  it('should properly narrow types when used as type guard', () => {
    const testValue: string | undefined =
      Math.random() > 0.5 ? 'test' : undefined

    if (isDef(testValue)) {
      // Inside this block, TypeScript should know testValue is string
      expect(testValue.toUpperCase()).toBeDefined()
    } else {
      expect(testValue).toBeUndefined()
    }
  })

  it('should return true for Symbol values', () => {
    expect(isDef(Symbol())).toBe(true)
    expect(isDef(Symbol('description'))).toBe(true)
  })

  it('should return true for bigint values', () => {
    expect(isDef(10n)).toBe(true)
  })
})

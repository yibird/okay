import { describe, expect, it } from 'vitest'
import { isDefined } from './isDefined'

describe('isDefined', () => {
  it('should return false for undefined', () => {
    expect(isDefined(undefined)).toBe(false)
  })

  it('should return true for null', () => {
    expect(isDefined(null)).toBe(true)
  })

  it('should return true for primitive values', () => {
    expect(isDefined(0)).toBe(true)
    expect(isDefined('')).toBe(true)
    expect(isDefined(false)).toBe(true)
    expect(isDefined(Number.NaN)).toBe(true)
  })

  it('should return true for objects', () => {
    expect(isDefined({})).toBe(true)
    expect(isDefined([])).toBe(true)
    expect(isDefined(new Date())).toBe(true)
  })

  it('should return true for functions', () => {
    expect(isDefined(() => {})).toBe(true)
    expect(isDefined(function () {})).toBe(true)
  })

  it('should properly narrow types when used as type guard', () => {
    const testValue: string | undefined = Math.random() > 0.5 ? 'test' : undefined

    if (isDefined(testValue)) {
      // Inside this block, TypeScript should know testValue is string
      expect(testValue.toUpperCase()).toBeDefined()
    } else {
      expect(testValue).toBeUndefined()
    }
  })

  it('should return true for Symbol values', () => {
    expect(isDefined(Symbol())).toBe(true)
    expect(isDefined(Symbol('description'))).toBe(true)
  })

  it('should return true for bigint values', () => {
    expect(isDefined(10n)).toBe(true)
  })
})

import { describe, expect, it } from 'vitest'
import { isNullOrUndef } from './is-null-or-undef'

describe('isNullOrUndef', () => {
  it('should return true for null or undefined', () => {
    expect(isNullOrUndef(null)).toBe(true)
    expect(isNullOrUndef(undefined)).toBe(true)
  })

  it('should return false for all other values', () => {
    // Primitives
    expect(isNullOrUndef(0)).toBe(false)
    expect(isNullOrUndef('')).toBe(false)
    expect(isNullOrUndef(false)).toBe(false)
    expect(isNullOrUndef(Number.NaN)).toBe(false)
    expect(isNullOrUndef(Symbol())).toBe(false)
    expect(isNullOrUndef(42)).toBe(false)
    expect(isNullOrUndef('hello')).toBe(false)
    expect(isNullOrUndef(true)).toBe(false)

    // Objects
    expect(isNullOrUndef({})).toBe(false)
    expect(isNullOrUndef([])).toBe(false)
    expect(isNullOrUndef(String(new Date()))).toBe(false)
    expect(isNullOrUndef(/regex/)).toBe(false)
    expect(isNullOrUndef(new Map())).toBe(false)
    expect(isNullOrUndef(new Set())).toBe(false)

    // Functions
    expect(isNullOrUndef(() => {})).toBe(false)
    expect(isNullOrUndef(function () {})).toBe(false)
  })

  it('should handle edge cases', () => {
    // Falsy values that aren't null/undefined
    expect(isNullOrUndef(0)).toBe(false)
    expect(isNullOrUndef('')).toBe(false)
    expect(isNullOrUndef(false)).toBe(false)

    // Document object model
    expect(isNullOrUndef(document)).toBe(false) // if running in browser env
    expect(isNullOrUndef(window)).toBe(false) // if running in browser env

    // Built-in objects
    expect(isNullOrUndef(Math)).toBe(false)
    expect(isNullOrUndef(JSON)).toBe(false)

    // Boxed primitives
    expect(isNullOrUndef(Number(0))).toBe(false)
    expect(isNullOrUndef(String(''))).toBe(false)
    expect(isNullOrUndef(Boolean(false))).toBe(false)
  })

  it('should work with type narrowing in TypeScript', () => {
    const testCases: unknown[] = [
      42,
      'hello',
      null,
      undefined,
      { key: 'value' },
    ]

    testCases.forEach((value) => {
      if (!isNullOrUndef(value)) {
        // Should be able to safely use value here
        expect(value).not.toBeNull()
        expect(value).not.toBeUndefined()
      } else {
        expect(value === null || value === undefined).toBe(true)
      }
    })
  })

  it('should return false for all other falsy values except null/undefined', () => {
    expect(isNullOrUndef(0)).toBe(false)
    expect(isNullOrUndef('')).toBe(false)
    expect(isNullOrUndef(false)).toBe(false)
    expect(isNullOrUndef(Number.NaN)).toBe(false)
  })

  it('should return true only for null or undefined', () => {
    // Verify no other values return true
    const falsyValues = [null, undefined, 0, '', false, Number.NaN]
    falsyValues.forEach((value) => {
      if (value === null || value === undefined) {
        expect(isNullOrUndef(value)).toBe(true)
      } else {
        expect(isNullOrUndef(value)).toBe(false)
      }
    })
  })
})

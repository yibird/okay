import { describe, expect, it } from 'vitest'
import { isNotNull } from './is-not-null'

describe('isNotNull', () => {
  it('should return false for null values', () => {
    expect(isNotNull(null)).toBe(false)
  })

  it('should return true for non-null values', () => {
    // Primitives
    expect(isNotNull(undefined)).toBe(true)
    expect(isNotNull(0)).toBe(true)
    expect(isNotNull('')).toBe(true)
    expect(isNotNull(false)).toBe(true)
    expect(isNotNull(Number.NaN)).toBe(true)

    // Objects
    expect(isNotNull({})).toBe(true)
    expect(isNotNull([])).toBe(true)
    expect(isNotNull(new Date())).toBe(true)
    expect(isNotNull(/regex/)).toBe(true)

    // Functions
    expect(isNotNull(() => {})).toBe(true)
    expect(isNotNull(function () {})).toBe(true)

    // Symbols
    expect(isNotNull(Symbol())).toBe(true)
  })

  it('should handle edge cases', () => {
    // Falsy values that aren't null
    expect(isNotNull(0)).toBe(true)
    expect(isNotNull('')).toBe(true)
    expect(isNotNull(false)).toBe(true)

    // Document object model
    expect(isNotNull(document)).toBe(true) // if running in browser env
    expect(isNotNull(window)).toBe(true) // if running in browser env

    // Built-in objects
    expect(isNotNull(Math)).toBe(true)
    expect(isNotNull(JSON)).toBe(true)
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
      if (isNotNull(value)) {
        // Should be able to safely use value here
        expect(value).not.toBeNull()
      } else {
        expect(value).toBeNull()
      }
    })
  })

  it('should return true for all other falsy values except null', () => {
    expect(isNotNull(undefined)).toBe(true)
    expect(isNotNull(0)).toBe(true)
    expect(isNotNull('')).toBe(true)
    expect(isNotNull(false)).toBe(true)
    expect(isNotNull(Number.NaN)).toBe(true)
  })
})

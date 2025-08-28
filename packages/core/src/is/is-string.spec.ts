import { describe, expect, it } from 'vitest'
import { isString } from './is-string'

describe('isString', () => {
  it('should return true for string primitives', () => {
    expect(isString('')).toBe(true)
    expect(isString('hello')).toBe(true)
    expect(isString(`template literal`)).toBe(true)
  })

  it('should return true for String objects', () => {
    expect(isString(String(''))).toBe(true)
    expect(isString(String('world'))).toBe(true)
  })

  it('should return false for non-string primitives', () => {
    expect(isString(123)).toBe(false)
    expect(isString(true)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString(undefined)).toBe(false)
    expect(isString(Symbol())).toBe(false)
    expect(isString(10n)).toBe(false)
  })

  it('should return false for non-string objects', () => {
    expect(isString({})).toBe(false)
    expect(isString([])).toBe(false)
    expect(isString(new Date())).toBe(false)
    expect(isString(/regex/)).toBe(false)
  })

  it('should properly narrow type to string when used as type guard', () => {
    const value: unknown = 'test string'

    if (isString(value)) {
      // TypeScript should know value is string here
      expect(value.toUpperCase()).toBe('TEST STRING')
    } else {
      expect(typeof value).not.toBe('string')
    }
  })

  it('should return false for string-like objects', () => {
    const stringLike = {
      toString: () => 'string like',
      valueOf: () => 'string like',
    }
    expect(isString(stringLike)).toBe(false)
  })

  it('should return true for empty strings', () => {
    expect(isString('')).toBe(true)
    expect(isString(String(''))).toBe(true)
  })

  it('should handle special string characters', () => {
    expect(isString('😊')).toBe(true)
    expect(isString('\u{1F600}')).toBe(true) // Unicode smiley
    expect(isString('\n\t\r')).toBe(true)
  })
})

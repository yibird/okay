import { describe, expect, it } from 'vitest'
import { isRegExp } from './is-reg-exp'

describe('isRegExp', () => {
  it('should return true for RegExp objects', () => {
    // Literal regex
    expect(isRegExp(/pattern/)).toBe(true)
    expect(isRegExp(/pattern/gi)).toBe(true)

    // Constructor regex
    expect(isRegExp(/pattern/)).toBe(true)
    expect(isRegExp(new RegExp('pattern'))).toBe(true)

    // Edge cases
    expect(isRegExp(new RegExp(''))).toBe(true) // empty pattern
    expect(isRegExp(/(?:)/)).toBe(true) // empty non-capturing group
  })

  it('should return false for non-RegExp values', () => {
    // Primitives
    expect(isRegExp(null)).toBe(false)
    expect(isRegExp(undefined)).toBe(false)
    expect(isRegExp(42)).toBe(false)
    expect(isRegExp('string')).toBe(false)
    expect(isRegExp(true)).toBe(false)
    expect(isRegExp(Symbol())).toBe(false)

    // Objects
    expect(isRegExp({})).toBe(false)
    expect(isRegExp([])).toBe(false)
    expect(isRegExp(new Date())).toBe(false)
    expect(isRegExp(new Map())).toBe(false)

    // String-like objects
    expect(isRegExp('regex')).toBe(false)
    expect(isRegExp(String('/pattern/'))).toBe(false)

    // Function
    expect(isRegExp(() => {})).toBe(false)

    // Other built-ins
    expect(isRegExp(Math)).toBe(false)
    expect(isRegExp(JSON)).toBe(false)
  })

  it('should handle edge cases', () => {
    // RegExp with special characters
    expect(isRegExp(/^\\d+$/)).toBe(true)
    expect(isRegExp(/[.*+?^${}()|[\]\\]/g)).toBe(true)

    // RegExp with large unicode
    expect(isRegExp(/\p{Emoji}/gu)).toBe(true)

    // RegExp subclass
    class MyRegExp extends RegExp {}
    expect(isRegExp(new MyRegExp('pattern'))).toBe(true)

    // Object pretending to be RegExp
    const fakeRegExp = {
      source: 'pattern',
      flags: 'gi',
      test: () => true,
      exec: () => null,
    }
    expect(isRegExp(fakeRegExp)).toBe(false)
  })

  it('should work with type narrowing in TypeScript', () => {
    const values: unknown[] = [/test/, /test/, 'not-regex', {}, null]

    values.forEach((value) => {
      if (isRegExp(value)) {
        // Should be able to use RegExp methods
        expect(value.test('test')).toBeDefined()
        expect(value.exec('test')).toBeDefined()
      } else {
        expect(
          value === null ||
            typeof value !== 'object' ||
            !(value instanceof RegExp),
        ).toBe(true)
      }
    })
  })

  it('should return false for RegExp-like objects', () => {
    // Correct way to create a RegExp-like object
    const regExpLike = {
      source: 'pattern',
      flags: 'gi',
      __proto__: RegExp.prototype, // Proper prototype chain
      test: () => true,
      exec: () => null,
    }
    expect(isRegExp(regExpLike)).toBe(false)

    // Alternative approach using Object.create
    const regExpLike2 = Object.create(RegExp.prototype)
    expect(isRegExp(regExpLike2)).toBe(false)

    // Should still fail even with all RegExp methods
    const regExpLike3 = {
      ...RegExp.prototype,
      source: 'pattern',
      flags: 'gi',
    }
    expect(isRegExp(regExpLike3)).toBe(false)
  })
})

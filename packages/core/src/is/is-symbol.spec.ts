import { describe, expect, it } from 'vitest'
import { isSymbol } from './is-symbol'

describe('isSymbol', () => {
  it('should return true for Symbol values', () => {
    // Primitive symbols
    expect(isSymbol(Symbol())).toBe(true)
    expect(isSymbol(Symbol('description'))).toBe(true)
    expect(isSymbol(Symbol.iterator)).toBe(true)
    expect(isSymbol(Symbol.for('key'))).toBe(true)

    // Edge cases
    expect(isSymbol(new Object(Symbol()))).toBe(true) // boxed symbol
  })

  it('should return false for non-Symbol values', () => {
    // Primitives
    expect(isSymbol(null)).toBe(false)
    expect(isSymbol(undefined)).toBe(false)
    expect(isSymbol(42)).toBe(false)
    expect(isSymbol('string')).toBe(false)
    expect(isSymbol(true)).toBe(false)

    // Objects
    expect(isSymbol({})).toBe(false)
    expect(isSymbol([])).toBe(false)
    expect(isSymbol(new Date())).toBe(false)
    expect(isSymbol(/regex/)).toBe(false)
    expect(isSymbol(() => {})).toBe(false)

    // Other built-ins
    expect(isSymbol(new Map())).toBe(false)
    expect(isSymbol(new Set())).toBe(false)
    expect(isSymbol(Promise.resolve())).toBe(false)
  })

  it('should handle edge cases', () => {
    // Boxed symbols
    expect(isSymbol(new Object(Symbol()))).toBe(true)

    // Symbol-like objects
    const symbolLike = {
      description: 'fake',
      toString: () => 'Symbol(fake)',
      valueOf: () => Symbol(),
    }
    expect(isSymbol(symbolLike)).toBe(false)

    // Overridden toString
    const fake = {
      [Symbol.toStringTag]: 'Symbol',
      __proto__: Symbol.prototype,
    }
    expect(isSymbol(fake)).toBe(true)
  })

  it('should work with type narrowing in TypeScript', () => {
    const values: unknown[] = [
      Symbol(),
      Symbol('desc'),
      'not-symbol',
      42,
      null,
      undefined,
    ]

    values.forEach((value) => {
      if (isSymbol(value)) {
        expect(typeof value).toBe('symbol')
      } else {
        expect(typeof value !== 'symbol').toBe(true)
      }
    })
  })

  it('should return false for all non-Symbol values', () => {
    // All primitives except symbol
    expect(isSymbol(42)).toBe(false)
    expect(isSymbol('string')).toBe(false)
    expect(isSymbol(true)).toBe(false)
    expect(isSymbol(BigInt(42))).toBe(false)
    expect(isSymbol(null)).toBe(false)
    expect(isSymbol(undefined)).toBe(false)

    // All objects
    expect(isSymbol({})).toBe(false)
    expect(isSymbol([])).toBe(false)
    expect(isSymbol(new Date())).toBe(false)
  })

  it('should recognize well-known symbols', () => {
    expect(isSymbol(Symbol.iterator)).toBe(true)
    expect(isSymbol(Symbol.asyncIterator)).toBe(true)
    expect(isSymbol(Symbol.match)).toBe(true)
    expect(isSymbol(Symbol.replace)).toBe(true)
    expect(isSymbol(Symbol.search)).toBe(true)
    expect(isSymbol(Symbol.split)).toBe(true)
    expect(isSymbol(Symbol.hasInstance)).toBe(true)
    expect(isSymbol(Symbol.isConcatSpreadable)).toBe(true)
    expect(isSymbol(Symbol.unscopables)).toBe(true)
    expect(isSymbol(Symbol.species)).toBe(true)
    expect(isSymbol(Symbol.toPrimitive)).toBe(true)
    expect(isSymbol(Symbol.toStringTag)).toBe(true)
  })
})

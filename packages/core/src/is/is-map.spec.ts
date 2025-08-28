import { describe, expect, it } from 'vitest'
import { isMap } from './is-map'

describe('isMap', () => {
  it('should return true for Map instances', () => {
    expect(isMap(new Map())).toBe(true)
    expect(isMap(new Map([['key', 'value']]))).toBe(true)
  })

  it('should return false for non-Map values', () => {
    // Primitives
    expect(isMap(undefined)).toBe(false)
    expect(isMap(null)).toBe(false)
    expect(isMap(42)).toBe(false)
    expect(isMap('string')).toBe(false)
    expect(isMap(true)).toBe(false)
    expect(isMap(Symbol('symbol'))).toBe(false)

    // Objects
    expect(isMap({})).toBe(false)
    expect(isMap({ key: 'value' })).toBe(false)
    expect(isMap([])).toBe(false)
    expect(isMap([1, 2, 3])).toBe(false)

    // Other collection types
    expect(isMap(new Set())).toBe(false)
    expect(isMap(new WeakMap())).toBe(false)
    expect(isMap(new WeakSet())).toBe(false)

    // Functions
    expect(isMap(() => {})).toBe(false)
    expect(isMap(function () {})).toBe(false)
  })
})

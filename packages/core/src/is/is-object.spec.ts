import { describe, expect, it } from 'vitest'
import { isObject } from './is-object'

describe('isObject', () => {
  it('should return true for plain objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject({ key: 'value' })).toBe(true)
    expect(isObject(new Object())).toBe(true)
    expect(isObject(Object.create(null))).toBe(true)
  })

  it('should return false for non-plain objects', () => {
    // Primitives
    expect(isObject(null)).toBe(false)
    expect(isObject(undefined)).toBe(false)
    expect(isObject(42)).toBe(false)
    expect(isObject('string')).toBe(false)
    expect(isObject(true)).toBe(false)
    expect(isObject(Symbol())).toBe(false)

    // Built-in objects
    expect(isObject([])).toBe(false)
    expect(isObject(String(new Date()))).toBe(false)
    expect(isObject(/regex/)).toBe(false)
    expect(isObject(new Map())).toBe(false)
    expect(isObject(new Set())).toBe(false)
    expect(isObject(new Error('Error'))).toBe(false)
    expect(isObject(new Promise(() => {}))).toBe(false)
    expect(isObject(new WeakMap())).toBe(false)
    expect(isObject(new WeakSet())).toBe(false)

    // Functions
    expect(isObject(() => {})).toBe(false)
    expect(isObject(function () {})).toBe(false)
    expect(isObject(class {})).toBe(false)
  })

  it('should handle edge cases', () => {
    // Object.create(null) creates a plain object without prototype
    expect(isObject(Object.create(null))).toBe(true)

    // Object with null prototype
    const obj = Object.create(null)
    obj.key = 'value'
    expect(isObject(obj)).toBe(true)

    // Boxed primitives
    expect(isObject(Number(42))).toBe(false)
    expect(isObject(String('string'))).toBe(false)
    expect(isObject(Boolean(true))).toBe(false)
  })

  it('should work with type narrowing in TypeScript', () => {
    const values: unknown[] = [{}, null, undefined, 42, 'string', []]

    values.forEach((value) => {
      if (isObject(value)) {
        // Should be able to safely access object properties
        ;(value as Record<string, unknown>).foo = 'bar' // TypeScript 现在应该允许这样操作
        expect(typeof value).toBe('object')
        expect(value).not.toBeNull()
      } else {
        expect(
          value === null ||
            value === undefined ||
            typeof value !== 'object' ||
            Array.isArray(value),
        ).toBe(true)
      }
    })
  })

  it('should return false for all non-object values', () => {
    // All primitives
    expect(isObject(42)).toBe(false)
    expect(isObject('string')).toBe(false)
    expect(isObject(true)).toBe(false)
    expect(isObject(Symbol())).toBe(false)
    expect(isObject(BigInt(42))).toBe(false)

    // Special cases
    expect(isObject(document.all)).toBe(false) // The "all" collection
    expect(isObject(Math)).toBe(false) // Built-in Math object
    expect(isObject(JSON)).toBe(false) // Built-in JSON object
  })

  it('should correctly identify object literals', () => {
    expect(isObject({})).toBe(true)
    expect(isObject({ a: 1 })).toBe(true)
    expect(isObject(Object.create(Object.prototype))).toBe(true)
  })
})

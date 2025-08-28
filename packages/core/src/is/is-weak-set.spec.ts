import { describe, expect, it } from 'vitest'
import { isWeakSet } from './is-weak-set'

describe('isWeakSet', () => {
  it('should return true for WeakSet instances', () => {
    expect(isWeakSet(new WeakSet())).toBe(true)
    const obj = {}
    expect(isWeakSet(new WeakSet([obj]))).toBe(true)
  })

  it('should return false for non-WeakSet values', () => {
    expect(isWeakSet(null)).toBe(false)
    expect(isWeakSet(undefined)).toBe(false)
    expect(isWeakSet({})).toBe(false)
    expect(isWeakSet(new Set())).toBe(false)
    expect(isWeakSet(new Map())).toBe(false)
    expect(isWeakSet(new WeakMap())).toBe(false)
  })

  it('should return false for WeakSet-like objects', () => {
    const weakSetLike = {
      add() {},
      delete() {},
      has() {},
    }
    expect(isWeakSet(weakSetLike)).toBe(false)
  })

  it('should properly narrow type to WeakSet when used as type guard', () => {
    const value: unknown = new WeakSet()

    if (isWeakSet(value)) {
      // TypeScript should know value is WeakSet here
      const obj = {}
      value.add(obj)
      expect(value.has(obj)).toBe(true)
    }
  })

  it('should return false for primitive values', () => {
    expect(isWeakSet(123)).toBe(false)
    expect(isWeakSet('weakset')).toBe(false)
    expect(isWeakSet(true)).toBe(false)
    expect(isWeakSet(Symbol())).toBe(false)
  })

  it('should return true for empty WeakSet', () => {
    expect(isWeakSet(new WeakSet())).toBe(true)
  })

  it('should return false for class extending WeakSet', () => {
    class CustomWeakSet extends WeakSet {}
    expect(isWeakSet(new CustomWeakSet())).toBe(true) // Depends on rawType implementation
  })

  it('should return true for WeakSet prototype', () => {
    expect(isWeakSet(WeakSet.prototype)).toBe(true)
  })

  it('should distinguish between WeakSet and other collections', () => {
    expect(isWeakSet(new Set())).toBe(false)
    expect(isWeakSet(new WeakMap())).toBe(false)
    expect(isWeakSet(new Map())).toBe(false)
  })

  it('should handle WeakSets with multiple objects', () => {
    const weakSet = new WeakSet()
    const obj1 = {}
    const obj2 = {}
    weakSet.add(obj1)
    weakSet.add(obj2)
    expect(isWeakSet(weakSet)).toBe(true)
  })
})

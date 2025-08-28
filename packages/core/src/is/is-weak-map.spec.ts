import { describe, expect, it } from 'vitest'
import { isWeakMap } from './is-weak-map'

describe('isWeakMap', () => {
  it('should return true for WeakMap instances', () => {
    expect(isWeakMap(new WeakMap())).toBe(true)

    const key = {}
    const weakMap = new WeakMap([[key, 'value']])
    expect(isWeakMap(weakMap)).toBe(true)
  })

  it('should return false for non-WeakMap values', () => {
    // Primitives
    expect(isWeakMap(null)).toBe(false)
    expect(isWeakMap(undefined)).toBe(false)
    expect(isWeakMap(42)).toBe(false)
    expect(isWeakMap('string')).toBe(false)
    expect(isWeakMap(true)).toBe(false)
    expect(isWeakMap(Symbol())).toBe(false)

    // Other collections
    expect(isWeakMap(new Map())).toBe(false)
    expect(isWeakMap(new Set())).toBe(false)
    expect(isWeakMap(new WeakSet())).toBe(false)

    // Objects
    expect(isWeakMap({})).toBe(false)
    expect(isWeakMap([])).toBe(false)
    expect(isWeakMap(new Date())).toBe(false)

    // Functions
    expect(isWeakMap(() => {})).toBe(false)
  })

  it('should handle edge cases', () => {
    // Empty WeakMap
    expect(isWeakMap(new WeakMap())).toBe(true)

    // WeakMap with null prototype
    const weakMap = Object.create(null)
    weakMap.set = () => {}
    weakMap.get = () => {}
    weakMap.delete = () => {}
    expect(isWeakMap(weakMap)).toBe(false)

    // WeakMap subclass
    class MyWeakMap extends WeakMap {}
    expect(isWeakMap(new MyWeakMap())).toBe(true)
  })

  it('should work with type narrowing in TypeScript', () => {
    const key = {}
    const values: unknown[] = [
      new WeakMap([[key, 'value']]),
      new Map(),
      {},
      null,
    ]

    values.forEach((value) => {
      if (isWeakMap(value)) {
        // Should be able to use WeakMap methods
        value.set(key, 'new value')
        expect(value.get(key)).toBeDefined()
      } else {
        expect(value === null || !(value instanceof WeakMap)).toBe(true)
      }
    })
  })

  it('should return true for WeakMap-like objects', () => {
    const weakMapLike = {
      set: () => {},
      get: () => {},
      delete: () => {},
      __proto__: WeakMap.prototype,
    }

    expect(isWeakMap(weakMapLike)).toBe(true)

    const weakMapLike2 = new Map()
    Object.setPrototypeOf(weakMapLike2, WeakMap.prototype)
    expect(isWeakMap(weakMapLike2)).toBe(true)
  })

  it('should recognize WeakMaps across realms', () => {
    // Simulate cross-realm WeakMap (e.g., iframe)
    const fakeRealm = {
      WeakMap: class WeakMap {
        get [Symbol.toStringTag]() {
          return 'WeakMap'
        }
      },
    }
    const crossRealmWeakMap = new fakeRealm.WeakMap()
    expect(isWeakMap(crossRealmWeakMap)).toBe(true)
  })
})

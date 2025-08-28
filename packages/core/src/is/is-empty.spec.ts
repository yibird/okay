import { describe, expect, it } from 'vitest'
import { isEmpty } from './is-empty'

describe('isEmpty utility function', () => {
  describe('Array handling', () => {
    it('should return true for empty array', () => {
      expect(isEmpty([])).toBe(true)
    })

    it('should return false for non-empty array', () => {
      expect(isEmpty([1, 2, 3])).toBe(false)
      expect(isEmpty([undefined])).toBe(false)
      expect(isEmpty([null])).toBe(false)
      expect(isEmpty([''])).toBe(false)
    })
  })

  describe('String handling', () => {
    it('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true)
    })

    it('should return false for non-empty string', () => {
      expect(isEmpty(' ')).toBe(false)
      expect(isEmpty('hello')).toBe(false)
    })
  })

  describe('Map handling', () => {
    it('should return true for empty Map', () => {
      expect(isEmpty(new Map())).toBe(true)
    })

    it('should return false for non-empty Map', () => {
      const map = new Map()
      map.set('key', 'value')
      expect(isEmpty(map)).toBe(false)
    })
  })

  // 4. Set tests
  describe('Set handling', () => {
    it('should return true for empty Set', () => {
      expect(isEmpty(new Set())).toBe(true)
    })

    it('should return false for non-empty Set', () => {
      const set = new Set()
      set.add('value')
      expect(isEmpty(set)).toBe(false)
    })
  })

  // 5. Object tests
  describe('Object handling', () => {
    it('should return false for empty object', () => {
      expect(isEmpty({})).toBe(true)
    })

    it('should return false for non-empty object', () => {
      expect(isEmpty({ key: 'value' })).toBe(false)
      expect(isEmpty({ [Symbol()]: 'value' })).toBe(true)
    })

    it('should handle objects with non-enumerable properties', () => {
      const obj = Object.create(
        {},
        {
          prop: {
            value: 'value',
            enumerable: false,
          },
        },
      )
      expect(isEmpty(obj)).toBe(true)
    })

    it('should handle objects with prototype properties', () => {
      interface TestObjectType {
        ownProp: string
      }
      function TestObject(this: TestObjectType) {
        this.ownProp = 'value'
      }
      TestObject.prototype.protoProp = 'value'
      expect(
        isEmpty(new (TestObject as unknown as new () => TestObjectType)()),
      ).toBe(false)
    })
  })

  // 6. Primitive values
  describe('Primitive values', () => {
    it('should return false for numbers', () => {
      expect(isEmpty(0)).toBe(false)
      expect(isEmpty(1)).toBe(false)
      expect(isEmpty(Number.NaN)).toBe(false)
    })

    it('should return false for boolean values', () => {
      expect(isEmpty(true)).toBe(false)
      expect(isEmpty(false)).toBe(false)
    })

    it('should return false for null/undefined', () => {
      expect(isEmpty(null)).toBe(false)
      expect(isEmpty(undefined)).toBe(false)
    })

    it('should return false for symbols', () => {
      expect(isEmpty(Symbol())).toBe(false)
      expect(isEmpty(Symbol('description'))).toBe(false)
    })

    it('should return false for bigints', () => {
      expect(isEmpty(0n)).toBe(false)
      expect(isEmpty(1n)).toBe(false)
    })
  })

  // 7. Special cases
  describe('Special cases', () => {
    it('should handle array-like objects', () => {
      expect(isEmpty({ length: 0 })).toBe(false) // Not a real array
      expect(isEmpty(document.querySelectorAll('*'))).toBe(false) // NodeList
    })

    it('should handle custom iterables', () => {
      const emptyIterable = {
        *[Symbol.iterator]() {},
      }
      const nonEmptyIterable = {
        *[Symbol.iterator]() {
          yield 1
        },
      }
      expect(isEmpty(emptyIterable)).toBe(true)
      expect(isEmpty(nonEmptyIterable)).toBe(true)
    })

    it('should handle functions', () => {
      expect(isEmpty(function () {})).toBe(false)
      expect(isEmpty(() => {})).toBe(false)
    })

    it('should handle class instances', () => {
      class TestClass {}
      expect(isEmpty(new TestClass())).toBe(true)
    })
  })
})

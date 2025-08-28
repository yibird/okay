import { describe, expect, it } from 'vitest'
import { isArray } from './is-array'

describe('isArray utility function', () => {
  it('should return true for empty arrays', () => {
    expect(isArray([])).toBe(true)
  })

  it('should return true for non-empty arrays', () => {
    expect(isArray([1, 2, 3])).toBe(true)
    expect(isArray(['a', 'b', 'c'])).toBe(true)
    expect(isArray([{}, null, undefined])).toBe(true)
  })

  it('should return true for array-like objects that are actually arrays', () => {
    expect(isArray(Array.from({ length: 5 }))).toBe(true)
    expect(isArray(Array.from('hello'))).toBe(true)
  })

  it('should return false for non-array values', () => {
    expect(isArray({})).toBe(false)
    expect(isArray({ length: 5 })).toBe(false) // array-like object
    expect(isArray('array')).toBe(false)
    expect(isArray(123)).toBe(false)
    expect(isArray(true)).toBe(false)
    expect(isArray(null)).toBe(false)
    expect(isArray(undefined)).toBe(false)
    expect(isArray(() => {})).toBe(false)
    expect(isArray(Symbol())).toBe(false)
  })

  it('should return false for array-like objects', () => {
    expect(
      isArray(
        (function (...args) {
          return args
        })(),
      ),
    ).toBe(true) // arguments object
    expect(isArray({ 0: 'a', 1: 'b', length: 2 })).toBe(false)
    expect(isArray(document.querySelectorAll('div'))).toBe(false) // NodeList
    expect(isArray('string')).toBe(false) // string has numeric indices and length
  })

  it('should return false for typed arrays (Uint8Array etc.)', () => {
    expect(isArray(new Uint8Array(10))).toBe(false)
    expect(isArray(new Float32Array(5))).toBe(false)
    expect(isArray(new Int32Array(7))).toBe(false)
  })

  // 3. Edge cases
  it('should return false for objects with Array in prototype chain', () => {
    const obj = {}
    Object.setPrototypeOf(obj, Array.prototype)
    expect(isArray(obj)).toBe(false)
  })

  it('should return false for Array constructor itself', () => {
    expect(isArray(Array)).toBe(false)
  })

  it('should handle arrays with modified prototype', () => {
    const arr: any = []
    arr.__proto__ = Object.prototype
    expect(isArray(arr)).toBe(true) // Still returns true because Array.isArray checks internal slot
  })

  it('should handle arrays from different realms (iframes)', () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const iframeArray = iframe.contentWindow?.window?.Array.from([1, 2, 3])
    expect(isArray(iframeArray)).toBe(true)
    iframe.remove()

    if (iframeArray) {
      expect(isArray(iframeArray)).toBe(true)
    }
  })
})

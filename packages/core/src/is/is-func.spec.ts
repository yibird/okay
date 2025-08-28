import { describe, expect, it } from 'vitest'
import { isFunc } from './is-func'

describe('isFunc', () => {
  it('should return true for function values', () => {
    // Regular functions
    expect(isFunc(function () {})).toBe(true)
    expect(isFunc(() => {})).toBe(true)

    // Arrow functions
    expect(isFunc(() => 42)).toBe(true)

    // Class constructors
    expect(isFunc(class {})).toBe(true)

    // Function constructor
    expect(isFunc(new Function())).toBe(true)
    expect(isFunc(new Function())).toBe(true)

    // Methods
    const obj = {
      method() {},
    }
    expect(isFunc(obj.method)).toBe(true)
  })

  it('should return false for non-function values', () => {
    // Primitives
    expect(isFunc(undefined)).toBe(false)
    expect(isFunc(null)).toBe(false)
    expect(isFunc(42)).toBe(false)
    expect(isFunc('string')).toBe(false)
    expect(isFunc(true)).toBe(false)
    expect(isFunc(Symbol('symbol'))).toBe(false)

    // Objects
    expect(isFunc({})).toBe(false)
    expect(isFunc([])).toBe(false)
    expect(isFunc(/regex/)).toBe(false)
    expect(isFunc(new Date())).toBe(false)

    // Object with call property but not actually a function
    expect(isFunc({ call: () => {} })).toBe(false)
  })

  it('should properly type guard when used with TypeScript', () => {
    const value: unknown = () => 'test'

    if (isFunc(value)) {
      // Should now be recognized as Function
      expect(value()).toBe('test')
    } else {
      expect.fail('Type guard failed')
    }
  })

  it('should handle edge cases', () => {
    // Functions with properties
    const funcWithProps = () => {}
    funcWithProps.someProp = 'value'
    expect(isFunc(funcWithProps)).toBe(true)

    // Async functions
    expect(isFunc(async () => {})).toBe(true)

    // Generator functions
    expect(isFunc(function* () {})).toBe(true)

    // Bound functions
    function testFunc() {}
    expect(isFunc(testFunc.bind(null))).toBe(true)
  })
})

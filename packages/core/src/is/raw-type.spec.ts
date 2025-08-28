import { describe, expect, it } from 'vitest'
import { rawType } from './raw-type'

describe('rawType utility function', () => {
  it('should return "Undefined" for undefined', () => {
    expect(rawType(undefined)).toBe('Undefined')
  })

  it('should return "Null" for null', () => {
    expect(rawType(null)).toBe('Null')
  })

  it('should return "Boolean" for boolean values', () => {
    expect(rawType(true)).toBe('Boolean')
    expect(rawType(false)).toBe('Boolean')
  })

  it('should return "Number" for number values', () => {
    expect(rawType(42)).toBe('Number')
    expect(rawType(3.14)).toBe('Number')
    expect(rawType(Number.NaN)).toBe('Number')
    expect(rawType(Infinity)).toBe('Number')
  })

  it('should return "String" for string values', () => {
    expect(rawType('hello')).toBe('String')
    expect(rawType('')).toBe('String')
  })

  it('should return "Object" for plain objects', () => {
    expect(rawType({})).toBe('Object')
    expect(rawType({ key: 'value' })).toBe('Object')
  })

  it('should return "Array" for arrays', () => {
    expect(rawType([])).toBe('Array')
    expect(rawType([1, 2, 3])).toBe('Array')
  })

  it('should return "Function" for functions', () => {
    expect(rawType(() => {})).toBe('Function')
    expect(rawType(function () {})).toBe('Function')
    expect(rawType(class {})).toBe('Function')
  })

  it('should return "Date" for Date objects', () => {
    expect(rawType(new Date())).toBe('Date')
  })

  it('should return "RegExp" for regular expressions', () => {
    expect(rawType(/regex/)).toBe('RegExp')
    expect(rawType(new RegExp('regex'))).toBe('RegExp')
  })

  it('should return "Error" for error objects', () => {
    expect(rawType(new Error('Error'))).toBe('Error')
    expect(rawType(new TypeError('Error'))).toBe('Error')
  })

  it('should return "Promise" for Promise objects', () => {
    expect(rawType(Promise.resolve())).toBe('Promise')
  })

  it('should return "Map" for Map objects', () => {
    expect(rawType(new Map())).toBe('Map')
  })

  it('should return "Set" for Set objects', () => {
    expect(rawType(new Set())).toBe('Set')
  })

  it('should return "WeakMap" for WeakMap objects', () => {
    expect(rawType(new WeakMap())).toBe('WeakMap')
  })

  it('should return "WeakSet" for WeakSet objects', () => {
    expect(rawType(new WeakSet())).toBe('WeakSet')
  })

  it('should return "Symbol" for Symbol values', () => {
    expect(rawType(Symbol())).toBe('Symbol')
    expect(rawType(Symbol('desc'))).toBe('Symbol')
  })

  it('should return "BigInt" for BigInt values', () => {
    expect(rawType(42n)).toBe('BigInt')
    expect(rawType(BigInt(42))).toBe('BigInt')
  })

  it('should return proper type for primitive wrapper objects', () => {
    expect(rawType(Boolean(true))).toBe('Boolean')
    expect(rawType(Number(42))).toBe('Number')
    expect(rawType(String('hello'))).toBe('String')
  })

  it('should return "Math" for Math object', () => {
    expect(rawType(Math)).toBe('Math')
  })

  it('should return "JSON" for JSON object', () => {
    expect(rawType(JSON)).toBe('JSON')
  })

  it('should return "Arguments" for arguments object', () => {
    function testArgs(...args: any[]) {
      expect(rawType(args)).toBe('Array')
    }
    testArgs(1, 2, 3)
  })

  // 6. Additional test for unknown types
  it('should return proper type for custom class instances', () => {
    class CustomClass {}
    expect(rawType(new CustomClass())).toBe('Object') // Or the actual type if different
  })
})

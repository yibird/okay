import { describe, expect, it } from 'vitest'
import { deepEqual } from './deepEqual'

describe('deepEqual', () => {
  it('primitives', () => {
    expect(deepEqual(1, 1)).toBe(true)
    expect(deepEqual(1, 2)).toBe(false)
    expect(deepEqual(NaN, NaN)).toBe(true)
    expect(deepEqual(null, null)).toBe(true)
    expect(deepEqual(null, undefined)).toBe(false)
    expect(deepEqual('a', 'a')).toBe(true)
  })

  it('plain objects', () => {
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false)
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
    expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false)
  })

  it('arrays', () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false)
    expect(deepEqual([1, 2], [1, 3])).toBe(false)
    // array vs non-array
    expect(deepEqual([1], { 0: 1, length: 1 })).toBe(false)
    // non-array vs array
    expect(deepEqual({ 0: 1, length: 1 }, [1])).toBe(false)
  })

  it('dates', () => {
    expect(deepEqual(new Date('2024-01-01'), new Date('2024-01-01'))).toBe(true)
    expect(deepEqual(new Date('2024-01-01'), new Date('2024-01-02'))).toBe(false)
    expect(deepEqual(new Date('2024-01-01'), {})).toBe(false)
    expect(deepEqual({}, new Date('2024-01-01'))).toBe(false)
  })

  it('regexps', () => {
    expect(deepEqual(/abc/gi, /abc/gi)).toBe(true)
    expect(deepEqual(/abc/g, /abc/i)).toBe(false)
    expect(deepEqual(/abc/, /def/)).toBe(false)
    expect(deepEqual(/abc/, {})).toBe(false)
    expect(deepEqual({}, /abc/)).toBe(false)
  })

  it('Maps', () => {
    expect(deepEqual(new Map([['a', 1]]), new Map([['a', 1]]))).toBe(true)
    expect(deepEqual(new Map([['a', 1]]), new Map([['a', 2]]))).toBe(false)
    expect(deepEqual(new Map([['a', 1]]), new Map())).toBe(false)
    // one side not a Map
    expect(deepEqual(new Map(), {})).toBe(false)
    expect(deepEqual({}, new Map())).toBe(false)
  })

  it('Sets', () => {
    expect(deepEqual(new Set([1, 2]), new Set([1, 2]))).toBe(true)
    expect(deepEqual(new Set([1, 2]), new Set([1, 3]))).toBe(false)
    expect(deepEqual(new Set([1]), new Set([1, 2]))).toBe(false)
    expect(deepEqual(new Set(), {})).toBe(false)
    expect(deepEqual({}, new Set())).toBe(false)
  })

  it('circular references', () => {
    const a: any = { x: 1 }
    a.self = a
    const b: any = { x: 1 }
    b.self = b
    expect(deepEqual(a, b)).toBe(true)

    const c: any = { x: 1 }
    c.self = c
    const d: any = { x: 2 }
    d.self = d
    expect(deepEqual(c, d)).toBe(false)
  })

  it('circular references in arrays', () => {
    const a: any[] = [1]
    a.push(a)
    const b: any[] = [1]
    b.push(b)
    expect(deepEqual(a, b)).toBe(true)

    const c: any[] = [1]
    c.push(c)
    const d: any[] = [2]
    d.push(d)
    expect(deepEqual(c, d)).toBe(false)
  })

  it('nested arrays', () => {
    expect(
      deepEqual(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [1, 2],
          [3, 4],
        ],
      ),
    ).toBe(true)
    expect(
      deepEqual(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [1, 2],
          [3, 5],
        ],
      ),
    ).toBe(false)
    expect(deepEqual([[1]], [[1, 2]])).toBe(false)
  })

  it('non-objectlike values return false for object comparisons', () => {
    expect(deepEqual(1, {})).toBe(false)
    expect(deepEqual({}, 1)).toBe(false)
  })

  it('objects with non-enumerable properties', () => {
    // Test that non-enumerable properties are ignored
    const a = { x: 1 }
    const b = { x: 1 }
    Object.defineProperty(a, 'hidden', { value: 'secret', enumerable: false })
    Object.defineProperty(b, 'hidden', { value: 'different', enumerable: false })
    // Should be true because non-enumerable properties are not compared
    expect(deepEqual(a, b)).toBe(true)

    // Test with one having non-enumerable and one not
    const c = { x: 1 }
    const d = { x: 1 }
    Object.defineProperty(c, 'hidden', { value: 'secret', enumerable: false })
    expect(deepEqual(c, d)).toBe(true)
  })
})

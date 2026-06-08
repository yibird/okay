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

  it('non-objectlike values return false for object comparisons', () => {
    expect(deepEqual(1, {})).toBe(false)
    expect(deepEqual({}, 1)).toBe(false)
  })
})

import { describe, expect, test } from 'vitest'
import { keyBy } from './keyBy'

describe('keyBy', () => {
  test('should convert array to object using key and value mappers', () => {
    const arr = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]
    const result = keyBy(
      arr,
      (item) => item.id,
      (item) => item.name,
    )
    expect(result).toEqual({
      1: 'Alice',
      2: 'Bob',
    })
  })

  test('should keep original items when value mapper is omitted', () => {
    const arr = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]

    expect(keyBy(arr, (item) => item.id)).toEqual({
      1: arr[0],
      2: arr[1],
    })
  })

  test('should handle empty array', () => {
    const result = keyBy(
      [],
      () => 'key',
      () => 'value',
    )
    expect(result).toEqual({})
  })

  test('should safely store prototype-like keys as own properties', () => {
    const result = keyBy(
      [{ key: '__proto__', value: { injected: true } }],
      (item) => item.key,
      (item) => item.value,
    )

    expect(Object.getPrototypeOf(result)).toBe(null)
    expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(true)
    expect(result.__proto__).toEqual({ injected: true })
  })

  test('should handle non-numeric keys', () => {
    const arr = [
      { key: 'a', value: 1 },
      { key: 'b', value: 2 },
    ]
    const result = keyBy(
      arr,
      (item) => item.key,
      (item) => item.value,
    )
    expect(result).toEqual({
      a: 1,
      b: 2,
    })
  })
})

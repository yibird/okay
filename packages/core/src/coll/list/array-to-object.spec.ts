import { describe, expect, test } from 'vitest'
import { arrayToObject } from './array-to-object'

describe('arrayToObject', () => {
  test('should convert array to object using key and value mappers', () => {
    const arr = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]
    const result = arrayToObject(
      arr,
      (item) => item.id,
      (item) => item.name,
    )
    expect(result).toEqual({
      1: 'Alice',
      2: 'Bob',
    })
  })

  test('should handle empty array', () => {
    const result = arrayToObject(
      [],
      () => 'key',
      () => 'value',
    )
    expect(result).toEqual({})
  })

  test('should handle non-numeric keys', () => {
    const arr = [
      { key: 'a', value: 1 },
      { key: 'b', value: 2 },
    ]
    const result = arrayToObject(
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

import { describe, expect, test } from 'vitest'
import { averageBy } from './average-by'

describe('averageBy', () => {
  test('should calculate average by property', () => {
    const arr = [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
    ]
    expect(averageBy(arr, (item) => item.value)).toBe(3)
  })

  test('should return 0 for empty array', () => {
    expect(averageBy([], () => 0)).toBe(0)
  })

  test('should handle negative values', () => {
    const arr = [{ value: -1 }, { value: -2 }, { value: -3 }]
    expect(averageBy(arr, (item) => item.value)).toBe(-2)
  })

  test('should handle mixed positive and negative values', () => {
    const arr = [{ value: 1 }, { value: -2 }, { value: 3 }]
    expect(averageBy(arr, (item) => item.value)).toBe(0.6666666666666666)
  })
})

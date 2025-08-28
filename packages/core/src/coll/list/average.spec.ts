import { describe, expect, test } from 'vitest'
import { average } from './average'

describe('average', () => {
  test('should calculate average of numbers', () => {
    expect(average([1, 2, 3, 4, 5])).toBe(3)
  })

  test('should return 0 for empty array', () => {
    expect(average([])).toBe(0)
  })

  test('should handle negative numbers', () => {
    expect(average([-1, -2, -3, -4, -5])).toBe(-3)
  })

  test('should handle mixed positive and negative numbers', () => {
    expect(average([1, -2, 3, -4, 5])).toBe(0.6)
  })
})

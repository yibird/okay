import { describe, expect, test } from 'vitest'
import { endOfYear } from './endOfYear'

describe('endOfYear', () => {
  test('should return last day of year', () => {
    const lastDay = endOfYear(2023)
    expect(lastDay.format('YYYY-MM-DD')).toBe('2023-12-31')
    expect(lastDay.hour()).toBe(23)
    expect(lastDay.minute()).toBe(59)
    expect(lastDay.second()).toBe(59)
  })

  test('should handle leap year', () => {
    const lastDay = endOfYear(2024)
    expect(lastDay.format('YYYY-MM-DD')).toBe('2024-12-31')
  })

  test('should throw when year is not an integer', () => {
    expect(() => endOfYear(2023.5)).toThrow(RangeError)
    expect(() => endOfYear(NaN)).toThrow(RangeError)
  })
})

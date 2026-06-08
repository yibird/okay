import { describe, expect, test } from 'vitest'
import { daysInMonth } from './daysInMonth'

describe('daysInMonth', () => {
  test('should return days in month for 31-day month', () => {
    expect(daysInMonth(2023, 1)).toBe(31)
    expect(daysInMonth(2023, 3)).toBe(31)
  })

  test('should return days in month for 30-day month', () => {
    expect(daysInMonth(2023, 4)).toBe(30)
    expect(daysInMonth(2023, 6)).toBe(30)
  })

  test('should handle leap year February', () => {
    expect(daysInMonth(2024, 2)).toBe(29)
  })

  test('should handle non-leap year February', () => {
    expect(daysInMonth(2023, 2)).toBe(28)
  })

  test('should reject invalid month values', () => {
    expect(() => daysInMonth(2023, 0)).toThrow('month must be between 1 and 12')
    expect(() => daysInMonth(2023, 13)).toThrow('month must be between 1 and 12')
  })

  test('should reject invalid year values', () => {
    expect(() => daysInMonth(2023.5, 1)).toThrow('year must be an integer')
  })
})

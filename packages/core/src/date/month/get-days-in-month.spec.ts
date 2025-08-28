import { describe, expect, test } from 'vitest'
import { getDaysInMonth } from './get-days-in-month'

describe('getDaysInMonth', () => {
  test('should return days in month for 31-day month', () => {
    expect(getDaysInMonth(2023, 1)).toBe(31)
    expect(getDaysInMonth(2023, 3)).toBe(31)
  })

  test('should return days in month for 30-day month', () => {
    expect(getDaysInMonth(2023, 4)).toBe(30)
    expect(getDaysInMonth(2023, 6)).toBe(30)
  })

  test('should handle leap year February', () => {
    expect(getDaysInMonth(2024, 2)).toBe(29)
  })

  test('should handle non-leap year February', () => {
    expect(getDaysInMonth(2023, 2)).toBe(28)
  })
})

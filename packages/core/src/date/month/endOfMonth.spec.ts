import { describe, expect, test } from 'vitest'
import { endOfMonth } from './endOfMonth'

describe('endOfMonth', () => {
  test('should return last day of month for 31-day month', () => {
    const lastDay = endOfMonth(2023, 1)
    expect(lastDay.format('YYYY-MM-DD')).toBe('2023-01-31')
    expect(lastDay.hour()).toBe(23)
    expect(lastDay.minute()).toBe(59)
    expect(lastDay.second()).toBe(59)
  })

  test('should handle leap year February', () => {
    const lastDay = endOfMonth(2024, 2)
    expect(lastDay.format('YYYY-MM-DD')).toBe('2024-02-29')
  })

  test('should handle non-leap year February', () => {
    const lastDay = endOfMonth(2023, 2)
    expect(lastDay.format('YYYY-MM-DD')).toBe('2023-02-28')
  })

  test('should reject invalid month values instead of rolling over', () => {
    expect(() => endOfMonth(2023, 0)).toThrow('month must be between 1 and 12')
    expect(() => endOfMonth(2023, 13)).toThrow('month must be between 1 and 12')
  })
})

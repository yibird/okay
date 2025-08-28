import { describe, expect, test } from 'vitest'
import { getLastDayOfMonth } from './get-last-day-of-month'

describe('getLastDayOfMonth', () => {
  test('should return last day of month for 31-day month', () => {
    const lastDay = getLastDayOfMonth(2023, 1)
    expect(lastDay.format('YYYY-MM-DD')).toBe('2023-01-31')
    expect(lastDay.hour()).toBe(23)
    expect(lastDay.minute()).toBe(59)
    expect(lastDay.second()).toBe(59)
  })

  test('should handle leap year February', () => {
    const lastDay = getLastDayOfMonth(2024, 2)
    expect(lastDay.format('YYYY-MM-DD')).toBe('2024-02-29')
  })

  test('should handle non-leap year February', () => {
    const lastDay = getLastDayOfMonth(2023, 2)
    expect(lastDay.format('YYYY-MM-DD')).toBe('2023-02-28')
  })
})

import { describe, expect, test } from 'vitest'
import { getLastDayOfYear } from './get-last-day-of-year'

describe('getLastDayOfYear', () => {
  test('should return last day of year', () => {
    const lastDay = getLastDayOfYear(2023)
    expect(lastDay.format('YYYY-MM-DD')).toBe('2023-12-31')
    expect(lastDay.hour()).toBe(23)
    expect(lastDay.minute()).toBe(59)
    expect(lastDay.second()).toBe(59)
  })

  test('should handle leap year', () => {
    const lastDay = getLastDayOfYear(2024)
    expect(lastDay.format('YYYY-MM-DD')).toBe('2024-12-31')
  })
})

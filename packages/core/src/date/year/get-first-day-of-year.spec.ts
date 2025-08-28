import { describe, expect, test } from 'vitest'
import { getFirstDayOfYear } from './get-first-day-of-year'

describe('getFirstDayOfYear', () => {
  test('should return first day of year', () => {
    const firstDay = getFirstDayOfYear(2023)
    expect(firstDay.format('YYYY-MM-DD')).toBe('2023-01-01')
    expect(firstDay.hour()).toBe(0)
    expect(firstDay.minute()).toBe(0)
    expect(firstDay.second()).toBe(0)
  })

  test('should handle leap year', () => {
    const firstDay = getFirstDayOfYear(2024)
    expect(firstDay.format('YYYY-MM-DD')).toBe('2024-01-01')
  })
})

import { describe, expect, test } from 'vitest'
import { getFirstDayOfMonth } from './get-first-day-of-month'

describe('getFirstDayOfMonth', () => {
  test('should return first day of month', () => {
    const firstDay = getFirstDayOfMonth(2023, 1)
    expect(firstDay.format('YYYY-MM-DD')).toBe('2023-01-01')
    expect(firstDay.hour()).toBe(0)
    expect(firstDay.minute()).toBe(0)
    expect(firstDay.second()).toBe(0)
  })

  test('should handle different months', () => {
    const firstDay = getFirstDayOfMonth(2023, 12)
    expect(firstDay.format('YYYY-MM-DD')).toBe('2023-12-01')
  })
})

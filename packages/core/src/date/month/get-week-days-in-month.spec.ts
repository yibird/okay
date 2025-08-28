import { describe, expect, test } from 'vitest'
import { getWeekdaysInMonth } from './get-week-days-in-month'

describe('getWeekdaysInMonth', () => {
  test('should return only weekdays in month', () => {
    const weekdays = getWeekdaysInMonth(2023, 1)
    // January 2023 has 22 weekdays
    expect(weekdays.length).toBe(22)
    weekdays.forEach((day) => {
      const dayOfWeek = day.day()
      expect(dayOfWeek).toBeGreaterThan(0)
      expect(dayOfWeek).toBeLessThan(6)
    })
  })

  test('should handle month with weekends at start and end', () => {
    const weekdays = getWeekdaysInMonth(2023, 4)
    // April 2023 has 20 weekdays
    expect(weekdays.length).toBe(20)
  })
})

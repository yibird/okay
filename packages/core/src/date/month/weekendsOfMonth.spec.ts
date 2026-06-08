import { describe, expect, test } from 'vitest'
import { weekendsOfMonth } from './weekendsOfMonth'

describe('weekendsOfMonth', () => {
  test('should return only weekends in month', () => {
    const weekends = weekendsOfMonth(2023, 1)
    // January 2023 has 9 weekends
    expect(weekends.length).toBe(9)
    weekends.forEach((day) => {
      const dayOfWeek = day.day()
      expect(dayOfWeek === 0 || dayOfWeek === 6).toBe(true)
    })
  })

  test('should handle month with different number of weekends', () => {
    const weekends = weekendsOfMonth(2023, 2)
    // February 2023 has 8 weekends
    expect(weekends.length).toBe(8)
  })
})

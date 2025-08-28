import { describe, expect, test } from 'vitest'
import { getAllDaysInMonth } from './get-all-days-in-month'

describe('getAllDaysInMonth', () => {
  test('should return all days in month', () => {
    const days = getAllDaysInMonth(2023, 1)
    expect(days.length).toBe(31)
    expect(days[0].format('YYYY-MM-DD')).toBe('2023-01-01')
    expect(days[30].format('YYYY-MM-DD')).toBe('2023-01-31')
  })

  test('should handle leap year February', () => {
    const days = getAllDaysInMonth(2024, 2)
    expect(days.length).toBe(29)
    expect(days[0].format('YYYY-MM-DD')).toBe('2024-02-01')
    expect(days[28].format('YYYY-MM-DD')).toBe('2024-02-29')
  })

  test('should handle non-leap year February', () => {
    const days = getAllDaysInMonth(2023, 2)
    expect(days.length).toBe(28)
    expect(days[0].format('YYYY-MM-DD')).toBe('2023-02-01')
    expect(days[27].format('YYYY-MM-DD')).toBe('2023-02-28')
  })
})

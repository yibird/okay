import { describe, expect, test } from 'vitest'
import { getMonthStartsInYear } from './get-month-starts-in-year'

describe('getMonthStartsInYear', () => {
  test('should return all month starts in year', () => {
    const starts = getMonthStartsInYear(2023)
    expect(starts.length).toBe(12)
    expect(starts[0].format('YYYY-MM-DD')).toBe('2023-01-01')
    expect(starts[11].format('YYYY-MM-DD')).toBe('2023-12-01')
  })

  test('should handle leap year', () => {
    const starts = getMonthStartsInYear(2024)
    expect(starts.length).toBe(12)
    expect(starts[1].format('YYYY-MM-DD')).toBe('2024-02-01')
  })
})

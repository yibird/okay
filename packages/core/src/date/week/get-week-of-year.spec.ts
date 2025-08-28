import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { getWeekOfYear } from './get-week-of-year'

describe('getWeekOfYear', () => {
  it('should return correct ISO week for current date', () => {
    const today = dayjs()
    const week = getWeekOfYear(today)
    expect(week).toBeGreaterThanOrEqual(1)
    expect(week).toBeLessThanOrEqual(53)
  })

  it('should return 1 for first ISO week of the year', () => {
    expect(getWeekOfYear('2024-01-04')).toBe(1)
  })

  it('should return last ISO week for last days of the year', () => {
    expect(getWeekOfYear('2020-12-31')).toBe(53)
  })

  it('should handle Sunday correctly (ISO weeks start on Monday)', () => {
    // 2023-01-01 is a Sunday and should be in week 52 of 2022
    expect(getWeekOfYear('2023-01-01')).toBe(52)
  })

  it('should match known ISO week numbers for given dates', () => {
    const cases: Array<[string, number]> = [
      ['2021-01-01', 53],
      ['2021-01-04', 1],
      ['2021-06-15', 24],
      ['2021-12-31', 52],
    ]
    for (const [date, expected] of cases) {
      expect(getWeekOfYear(date)).toBe(expected)
    }
  })

  it('should default to current date when no argument is provided', () => {
    const expected = getWeekOfYear(dayjs())
    const result = getWeekOfYear()
    expect(result).toBe(expected)
  })
})

import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { endOfQuarter } from './endOfQuarter'

describe('endOfQuarter', () => {
  it('should return correct quarter end dates for each quarter', () => {
    // Q1 (Jan-Mar)
    expect(endOfQuarter('2023-01-15').format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
      '2023-03-31 23:59:59.999',
    )
    expect(endOfQuarter('2023-02-28').format('YYYY-MM-DD')).toBe('2023-03-31')
    expect(endOfQuarter('2023-03-01').format('YYYY-MM-DD')).toBe('2023-03-31')

    // Q2 (Apr-Jun)
    expect(endOfQuarter('2023-04-01').format('YYYY-MM-DD')).toBe('2023-06-30')
    expect(endOfQuarter('2023-05-15').format('YYYY-MM-DD')).toBe('2023-06-30')
    expect(endOfQuarter('2023-06-30').format('YYYY-MM-DD')).toBe('2023-06-30')

    // Q3 (Jul-Sep)
    expect(endOfQuarter('2023-07-01').format('YYYY-MM-DD')).toBe('2023-09-30')
    expect(endOfQuarter('2023-08-15').format('YYYY-MM-DD')).toBe('2023-09-30')
    expect(endOfQuarter('2023-09-30').format('YYYY-MM-DD')).toBe('2023-09-30')

    // Q4 (Oct-Dec)
    expect(endOfQuarter('2023-10-01').format('YYYY-MM-DD')).toBe('2023-12-31')
    expect(endOfQuarter('2023-11-15').format('YYYY-MM-DD')).toBe('2023-12-31')
    expect(endOfQuarter('2023-12-31').format('YYYY-MM-DD')).toBe('2023-12-31')
  })

  it('should handle leap years correctly', () => {
    expect(endOfQuarter('2020-01-15').format('YYYY-MM-DD')).toBe('2020-03-31') // Not a leap year quarter
    expect(endOfQuarter('2020-02-15').format('YYYY-MM-DD')).toBe('2020-03-31')
    expect(endOfQuarter('2024-01-15').format('YYYY-MM-DD')).toBe('2024-03-31')
  })

  it('should use current date when no date is provided', () => {
    const today = dayjs()
    const quarter = Math.floor(today.month() / 3)
    const expectedMonth = quarter * 3 + 2
    const expectedDate = dayjs().month(expectedMonth).endOf('month')

    expect(endOfQuarter().isSame(expectedDate, 'day')).toBe(true)
  })

  it('should handle different date formats', () => {
    const testDate = '2023-07-15'
    const expected = '2023-09-30 23:59:59.999'

    expect(endOfQuarter(new Date(testDate)).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(expected)
    expect(endOfQuarter(testDate).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(expected)
    expect(endOfQuarter(dayjs(testDate)).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(expected)
    expect(endOfQuarter(1689360000000).format('YYYY-MM-DD HH:mm:ss.SSS')).toBe(
      '2023-09-30 23:59:59.999',
    )
  })

  it('should handle empty values as current date and reject invalid dates', () => {
    const todayQuarterEnd = endOfQuarter()

    expect(() => endOfQuarter('invalid-date')).toThrow('Invalid date provided')
    expect(endOfQuarter('').isSame(todayQuarterEnd, 'day')).toBe(true)
    expect(endOfQuarter(null).isSame(todayQuarterEnd, 'day')).toBe(true)
    expect(endOfQuarter(undefined).isSame(todayQuarterEnd, 'day')).toBe(true)
  })

  it('should return time set to end of day', () => {
    const result = endOfQuarter('2023-04-15')
    expect(result.hour()).toBe(23)
    expect(result.minute()).toBe(59)
    expect(result.second()).toBe(59)
    expect(result.millisecond()).toBe(999)
  })

  it('should handle timezone correctly', () => {
    // Test with UTC and local time
    const utcDate = '2023-01-01T00:00:00Z'
    const localDate = '2023-01-01'

    expect(endOfQuarter(utcDate).format('YYYY-MM-DD')).toBe('2023-03-31')
    expect(endOfQuarter(localDate).format('YYYY-MM-DD')).toBe('2023-03-31')
  })
})

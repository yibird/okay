import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { getLastDayOfQuarter } from './get-last-day-of-quarter'

describe('getLastDayOfQuarter', () => {
  it('should return correct quarter end dates for each quarter', () => {
    // Q1 (Jan-Mar)
    expect(
      getLastDayOfQuarter('2023-01-15').format('YYYY-MM-DD HH:mm:ss.SSS'),
    ).toBe('2023-03-31 23:59:59.999')
    expect(getLastDayOfQuarter('2023-02-28').format('YYYY-MM-DD')).toBe(
      '2023-03-31',
    )
    expect(getLastDayOfQuarter('2023-03-01').format('YYYY-MM-DD')).toBe(
      '2023-03-31',
    )

    // Q2 (Apr-Jun)
    expect(getLastDayOfQuarter('2023-04-01').format('YYYY-MM-DD')).toBe(
      '2023-06-30',
    )
    expect(getLastDayOfQuarter('2023-05-15').format('YYYY-MM-DD')).toBe(
      '2023-06-30',
    )
    expect(getLastDayOfQuarter('2023-06-30').format('YYYY-MM-DD')).toBe(
      '2023-06-30',
    )

    // Q3 (Jul-Sep)
    expect(getLastDayOfQuarter('2023-07-01').format('YYYY-MM-DD')).toBe(
      '2023-09-30',
    )
    expect(getLastDayOfQuarter('2023-08-15').format('YYYY-MM-DD')).toBe(
      '2023-09-30',
    )
    expect(getLastDayOfQuarter('2023-09-30').format('YYYY-MM-DD')).toBe(
      '2023-09-30',
    )

    // Q4 (Oct-Dec)
    expect(getLastDayOfQuarter('2023-10-01').format('YYYY-MM-DD')).toBe(
      '2023-12-31',
    )
    expect(getLastDayOfQuarter('2023-11-15').format('YYYY-MM-DD')).toBe(
      '2023-12-31',
    )
    expect(getLastDayOfQuarter('2023-12-31').format('YYYY-MM-DD')).toBe(
      '2023-12-31',
    )
  })

  it('should handle leap years correctly', () => {
    expect(getLastDayOfQuarter('2020-01-15').format('YYYY-MM-DD')).toBe(
      '2020-03-31',
    ) // Not a leap year quarter
    expect(getLastDayOfQuarter('2020-02-15').format('YYYY-MM-DD')).toBe(
      '2020-03-31',
    )
    expect(getLastDayOfQuarter('2024-01-15').format('YYYY-MM-DD')).toBe(
      '2024-03-31',
    )
  })

  it('should use current date when no date is provided', () => {
    const today = dayjs()
    const quarter = Math.floor(today.month() / 3)
    const expectedMonth = quarter * 3 + 2
    const expectedDate = dayjs().month(expectedMonth).endOf('month')

    expect(getLastDayOfQuarter().isSame(expectedDate, 'day')).toBe(true)
  })

  it('should handle different date formats', () => {
    const testDate = '2023-07-15'
    const expected = '2023-09-30 23:59:59.999'

    expect(
      getLastDayOfQuarter(new Date(testDate)).format('YYYY-MM-DD HH:mm:ss.SSS'),
    ).toBe(expected)
    expect(
      getLastDayOfQuarter(testDate).format('YYYY-MM-DD HH:mm:ss.SSS'),
    ).toBe(expected)
    expect(
      getLastDayOfQuarter(dayjs(testDate)).format('YYYY-MM-DD HH:mm:ss.SSS'),
    ).toBe(expected)
    expect(
      getLastDayOfQuarter(1689360000000).format('YYYY-MM-DD HH:mm:ss.SSS'),
    ).toBe('2023-09-30 23:59:59.999')
  })

  it('should handle invalid dates by using current date', () => {
    const todayQuarterEnd = getLastDayOfQuarter()

    expect(
      getLastDayOfQuarter('invalid-date').isSame(todayQuarterEnd, 'day'),
    ).toBe(true)
    expect(getLastDayOfQuarter('').isSame(todayQuarterEnd, 'day')).toBe(true)
    expect(getLastDayOfQuarter(null).isSame(todayQuarterEnd, 'day')).toBe(true)
    expect(getLastDayOfQuarter(undefined).isSame(todayQuarterEnd, 'day')).toBe(
      true,
    )
  })

  it('should return time set to end of day', () => {
    const result = getLastDayOfQuarter('2023-04-15')
    expect(result.hour()).toBe(23)
    expect(result.minute()).toBe(59)
    expect(result.second()).toBe(59)
    expect(result.millisecond()).toBe(999)
  })

  it('should handle timezone correctly', () => {
    // Test with UTC and local time
    const utcDate = '2023-01-01T00:00:00Z'
    const localDate = '2023-01-01'

    expect(getLastDayOfQuarter(utcDate).format('YYYY-MM-DD')).toBe('2023-03-31')
    expect(getLastDayOfQuarter(localDate).format('YYYY-MM-DD')).toBe(
      '2023-03-31',
    )
  })
})

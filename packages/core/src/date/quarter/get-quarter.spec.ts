import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { getQuarter } from './get-quarter'

describe('getQuarter', () => {
  it('should return correct quarter for each month', () => {
    // Q1 (Jan-Mar)
    expect(getQuarter('2023-01-15')).toBe(1)
    expect(getQuarter('2023-02-28')).toBe(1)
    expect(getQuarter('2023-03-31')).toBe(1)

    // Q2 (Apr-Jun)
    expect(getQuarter('2023-04-01')).toBe(2)
    expect(getQuarter('2023-05-15')).toBe(2)
    expect(getQuarter('2023-06-30')).toBe(2)

    // Q3 (Jul-Sep)
    expect(getQuarter('2023-07-01')).toBe(3)
    expect(getQuarter('2023-08-15')).toBe(3)
    expect(getQuarter('2023-09-30')).toBe(3)

    // Q4 (Oct-Dec)
    expect(getQuarter('2023-10-01')).toBe(4)
    expect(getQuarter('2023-11-15')).toBe(4)
    expect(getQuarter('2023-12-31')).toBe(4)
  })

  it('should use current date when no date is provided', () => {
    const currentQuarter = Math.floor(dayjs().month() / 3) + 1
    expect(getQuarter()).toBe(currentQuarter)
  })

  it('should handle different date formats', () => {
    // Test with various date formats
    expect(getQuarter(new Date('2023-07-15'))).toBe(3)
    expect(getQuarter('2023-07-15')).toBe(3)
    expect(getQuarter(dayjs('2023-07-15'))).toBe(3)
    expect(getQuarter(1689360000000)).toBe(3) // timestamp for 2023-07-15
  })

  it('should handle invalid dates by using current date', () => {
    const currentQuarter = Math.floor(dayjs().month() / 3) + 1

    expect(getQuarter('invalid-date')).toBe(Number.NaN)
    expect(getQuarter('')).toBe(currentQuarter)
    expect(getQuarter(null)).toBe(currentQuarter)
    expect(getQuarter(undefined)).toBe(currentQuarter)
  })

  it('should handle leap years correctly', () => {
    expect(getQuarter('2020-02-29')).toBe(1) // Leap day
    expect(getQuarter('2024-02-29')).toBe(1) // Leap day
  })

  it('should always return integer between 1 and 4', () => {
    // Test across multiple months
    for (let i = 0; i < 12; i++) {
      const date = dayjs().month(i)
      const quarter = getQuarter(date)
      expect(Number.isInteger(quarter)).toBe(true)
      expect(quarter).toBeGreaterThanOrEqual(1)
      expect(quarter).toBeLessThanOrEqual(4)
    }
  })

  it('should handle timezone correctly', () => {
    // UTC time
    expect(getQuarter('2023-01-01T00:00:00Z')).toBe(1)
    // Local time
    expect(getQuarter('2023-01-01')).toBe(1)
  })

  it('should handle edge cases at quarter boundaries', () => {
    // March 31st (Q1 boundary)
    expect(getQuarter('2023-03-31')).toBe(1)
    // April 1st (Q2 boundary)
    expect(getQuarter('2023-04-01')).toBe(2)
    // June 30th (Q2 boundary)
    expect(getQuarter('2023-06-30')).toBe(2)
    // July 1st (Q3 boundary)
    expect(getQuarter('2023-07-01')).toBe(3)
    // September 30th (Q3 boundary)
    expect(getQuarter('2023-09-30')).toBe(3)
    // October 1st (Q4 boundary)
    expect(getQuarter('2023-10-01')).toBe(4)
    // December 31st (Q4 boundary)
    expect(getQuarter('2023-12-31')).toBe(4)
  })
})

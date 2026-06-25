import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { quarter } from './quarter'

describe('quarter', () => {
  it('should return correct quarter for each month', () => {
    // Q1 (Jan-Mar)
    expect(quarter('2023-01-15')).toBe(1)
    expect(quarter('2023-02-28')).toBe(1)
    expect(quarter('2023-03-31')).toBe(1)

    // Q2 (Apr-Jun)
    expect(quarter('2023-04-01')).toBe(2)
    expect(quarter('2023-05-15')).toBe(2)
    expect(quarter('2023-06-30')).toBe(2)

    // Q3 (Jul-Sep)
    expect(quarter('2023-07-01')).toBe(3)
    expect(quarter('2023-08-15')).toBe(3)
    expect(quarter('2023-09-30')).toBe(3)

    // Q4 (Oct-Dec)
    expect(quarter('2023-10-01')).toBe(4)
    expect(quarter('2023-11-15')).toBe(4)
    expect(quarter('2023-12-31')).toBe(4)
  })

  it('should use current date when no date is provided', () => {
    const expectedQuarter = Math.floor(dayjs().month() / 3) + 1
    expect(quarter()).toBe(expectedQuarter)
  })

  it('should handle different date formats', () => {
    // Test with various date formats
    expect(quarter(new Date('2023-07-15'))).toBe(3)
    expect(quarter('2023-07-15')).toBe(3)
    expect(quarter(dayjs('2023-07-15'))).toBe(3)
    expect(quarter(1689360000000)).toBe(3) // timestamp for 2023-07-15
  })

  it('should handle empty values as current date and reject invalid dates', () => {
    const expectedQuarter = Math.floor(dayjs().month() / 3) + 1

    expect(() => quarter('invalid-date')).toThrow('Invalid date provided')
    expect(quarter('')).toBe(expectedQuarter)
    expect(quarter(null)).toBe(expectedQuarter)
    expect(quarter(undefined)).toBe(expectedQuarter)
  })

  it('should handle leap years correctly', () => {
    expect(quarter('2020-02-29')).toBe(1) // Leap day
    expect(quarter('2024-02-29')).toBe(1) // Leap day
  })

  it('should always return integer between 1 and 4', () => {
    // Test across multiple months
    for (let i = 0; i < 12; i++) {
      const date = dayjs().month(i)
      const resultQuarter = quarter(date)
      expect(Number.isInteger(resultQuarter)).toBe(true)
      expect(resultQuarter).toBeGreaterThanOrEqual(1)
      expect(resultQuarter).toBeLessThanOrEqual(4)
    }
  })

  it('should handle timezone correctly', () => {
    // UTC time
    expect(quarter('2023-01-01T00:00:00Z')).toBe(1)
    // Local time
    expect(quarter('2023-01-01')).toBe(1)
  })

  it('should handle edge cases at quarter boundaries', () => {
    // March 31st (Q1 boundary)
    expect(quarter('2023-03-31')).toBe(1)
    // April 1st (Q2 boundary)
    expect(quarter('2023-04-01')).toBe(2)
    // June 30th (Q2 boundary)
    expect(quarter('2023-06-30')).toBe(2)
    // July 1st (Q3 boundary)
    expect(quarter('2023-07-01')).toBe(3)
    // September 30th (Q3 boundary)
    expect(quarter('2023-09-30')).toBe(3)
    // October 1st (Q4 boundary)
    expect(quarter('2023-10-01')).toBe(4)
    // December 31st (Q4 boundary)
    expect(quarter('2023-12-31')).toBe(4)
  })
})

import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { getQuarterOfYear } from './get-quarter-of-year'

describe('getQuarterOfYear', () => {
  it('should handle current date correctly', () => {
    const result = getQuarterOfYear()
    const now = dayjs()
    const expectedQuarter = Math.floor(now.month() / 3) + 1

    expect(result.quarter).toBe(expectedQuarter)
    expect(result.year).toBe(now.year())
    expect(result.text).toBe(`Q${expectedQuarter}`)
  })

  it('should return correct Q1 details for dates in Q1', () => {
    const date = '2023-02-15'
    const result = getQuarterOfYear(date)

    expect(result.quarter).toBe(1)
    expect(result.startTime.format('YYYY-MM-DD')).toBe('2023-01-01')
    expect(result.endTime.format('YYYY-MM-DD')).toBe('2023-03-31')
    expect(result.text).toBe('Q1')
    expect(result.year).toBe(2023)
  })

  it('should return correct Q2 details for dates in Q2', () => {
    const date = '2023-05-20'
    const result = getQuarterOfYear(date)

    expect(result.quarter).toBe(2)
    expect(result.startTime.format('YYYY-MM-DD')).toBe('2023-04-01')
    expect(result.endTime.format('YYYY-MM-DD')).toBe('2023-06-30')
    expect(result.text).toBe('Q2')
    expect(result.year).toBe(2023)
  })

  it('should return correct Q3 details for dates in Q3', () => {
    const date = '2023-08-15'
    const result = getQuarterOfYear(date)

    expect(result.quarter).toBe(3)
    expect(result.startTime.format('YYYY-MM-DD')).toBe('2023-07-01')
    expect(result.endTime.format('YYYY-MM-DD')).toBe('2023-09-30')
    expect(result.text).toBe('Q3')
    expect(result.year).toBe(2023)
  })

  it('should return correct Q4 details for dates in Q4', () => {
    const date = '2023-11-15'
    const result = getQuarterOfYear(date)

    expect(result.quarter).toBe(4)
    expect(result.startTime.format('YYYY-MM-DD')).toBe('2023-10-01')
    expect(result.endTime.format('YYYY-MM-DD')).toBe('2023-12-31')
    expect(result.text).toBe('Q4')
    expect(result.year).toBe(2023)
  })

  it('should handle year-crossing dates correctly', () => {
    const date = '2022-01-01'
    const result = getQuarterOfYear(date)

    expect(result.quarter).toBe(1)
    expect(result.startTime.format('YYYY-MM-DD')).toBe('2022-01-01')
    expect(result.endTime.format('YYYY-MM-DD')).toBe('2022-03-31')
    expect(result.year).toBe(2022)
  })

  it('should accept Date object as input', () => {
    const date = new Date('2023-07-01')
    const result = getQuarterOfYear(date)

    expect(result.quarter).toBe(3)
    expect(result.year).toBe(2023)
  })

  it('should accept timestamp as input', () => {
    const timestamp = new Date('2023-04-01').getTime()
    const result = getQuarterOfYear(timestamp)

    expect(result.quarter).toBe(2)
    expect(result.year).toBe(2023)
  })

  it('should handle quarter boundary dates correctly', () => {
    // Last day of Q1
    const q1End = getQuarterOfYear('2023-03-31')
    expect(q1End.quarter).toBe(1)

    // First day of Q2
    const q2Start = getQuarterOfYear('2023-04-01')
    expect(q2Start.quarter).toBe(2)

    // Last day of Q4
    const q4End = getQuarterOfYear('2023-12-31')
    expect(q4End.quarter).toBe(4)
  })

  it('should handle leap year February correctly', () => {
    const leapYearQ1 = getQuarterOfYear('2024-02-29')
    expect(leapYearQ1.quarter).toBe(1)
    expect(leapYearQ1.startTime.format('YYYY-MM-DD')).toBe('2024-01-01')
    expect(leapYearQ1.endTime.format('YYYY-MM-DD')).toBe('2024-03-31')
  })
})

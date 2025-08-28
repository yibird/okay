import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { getFirstDayOfQuarter } from './get-first-day-of-quarter'

describe('getFirstDayOfQuarter', () => {
  it('should return Q1 start date for January', () => {
    const date = dayjs('2023-01-15')
    const result = getFirstDayOfQuarter(date)
    expect(result.format('YYYY-MM-DD')).toBe('2023-01-01')
  })

  it('should return Q1 start date for March', () => {
    const date = dayjs('2023-03-31')
    const result = getFirstDayOfQuarter(date)
    expect(result.format('YYYY-MM-DD')).toBe('2023-01-01')
  })

  it('should return Q2 start date for April', () => {
    const date = dayjs('2023-04-01')
    const result = getFirstDayOfQuarter(date)
    expect(result.format('YYYY-MM-DD')).toBe('2023-04-01')
  })

  it('should return Q2 start date for June', () => {
    const date = dayjs('2023-06-15')
    const result = getFirstDayOfQuarter(date)
    expect(result.format('YYYY-MM-DD')).toBe('2023-04-01')
  })

  it('should return Q3 start date for July', () => {
    const date = dayjs('2023-07-01')
    const result = getFirstDayOfQuarter(date)
    expect(result.format('YYYY-MM-DD')).toBe('2023-07-01')
  })

  it('should return Q3 start date for September', () => {
    const date = dayjs('2023-09-30')
    const result = getFirstDayOfQuarter(date)
    expect(result.format('YYYY-MM-DD')).toBe('2023-07-01')
  })

  it('should return Q4 start date for October', () => {
    const date = dayjs('2023-10-15')
    const result = getFirstDayOfQuarter(date)
    expect(result.format('YYYY-MM-DD')).toBe('2023-10-01')
  })

  it('should return Q4 start date for December', () => {
    const date = dayjs('2023-12-31')
    const result = getFirstDayOfQuarter(date)
    expect(result.format('YYYY-MM-DD')).toBe('2023-10-01')
  })

  it('should handle string input', () => {
    const result = getFirstDayOfQuarter('2020-06-01')
    expect(result.format('YYYY-MM-DD')).toBe('2020-04-01')
  })

  it('should handle Date object input', () => {
    const result = getFirstDayOfQuarter(new Date(2023, 7, 15)) // August (Q3)
    expect(result.format('YYYY-MM-DD')).toBe('2023-07-01')
  })

  it('should handle timestamp input', () => {
    const timestamp = new Date(2023, 10, 15).getTime() // November (Q4)
    const result = getFirstDayOfQuarter(timestamp)
    expect(result.format('YYYY-MM-DD')).toBe('2023-10-01')
  })

  it('should reset time to 00:00:00', () => {
    const date = dayjs('2023-08-15T15:30:45')
    const result = getFirstDayOfQuarter(date)
    expect(result.format('HH:mm:ss')).toBe('00:00:00')
  })
})

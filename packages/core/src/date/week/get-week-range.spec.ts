import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { getWeekRange } from './get-week-range'

describe('getWeekRange', () => {
  it('should return correct week range for a mid-week date', () => {
    const date = '2023-11-08' // Wednesday
    const { startTime, endTime } = getWeekRange(date)
    expect(startTime.format('YYYY-MM-DD')).toBe('2023-11-06') // Monday
    expect(endTime.format('YYYY-MM-DD')).toBe('2023-11-12') // Sunday
    expect(startTime.isBefore(endTime)).toBe(true)
  })

  it('should handle input as dayjs instance', () => {
    const date = dayjs('2023-11-08')
    const { startTime, endTime } = getWeekRange(date)
    expect(startTime.format('YYYY-MM-DD')).toBe('2023-11-06')
    expect(endTime.format('YYYY-MM-DD')).toBe('2023-11-12')
  })

  it('should use current date if no date is provided', () => {
    const { startTime, endTime } = getWeekRange()
    expect(startTime.isBefore(endTime)).toBe(true)
    expect(startTime.day()).toBe(1) // Monday
    expect(endTime.day()).toBe(0) // Sunday
  })

  it('should handle weeks that span a month boundary', () => {
    const date = '2023-10-31' // Tuesday
    const { startTime, endTime } = getWeekRange(date)
    expect(startTime.format('YYYY-MM-DD')).toBe('2023-10-30') // Monday
    expect(endTime.format('YYYY-MM-DD')).toBe('2023-11-05') // Sunday
  })

  it('should handle weeks that span a year boundary', () => {
    const date = '2022-12-31' // Saturday
    const { startTime, endTime } = getWeekRange(date)
    expect(startTime.format('YYYY-MM-DD')).toBe('2022-12-26') // Monday
    expect(endTime.format('YYYY-MM-DD')).toBe('2023-01-01') // Sunday
  })

  it('should return Monday as start and Sunday as end for the correct day order', () => {
    const date = '2023-11-08'
    const { startTime, endTime } = getWeekRange(date)
    expect(startTime.day()).toBe(1) // Monday
    expect(endTime.day()).toBe(0) // Sunday
  })
})

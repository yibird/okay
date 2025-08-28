import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { getWeekDays } from './get-week-days'

describe('getWeekDays', () => {
  it('should return 7 days for a regular mid-week date', () => {
    const date = '2023-11-08' // Wednesday
    const weekDays = getWeekDays(date)
    expect(weekDays.length).toBe(7)
    expect(weekDays[0].day()).toBe(1) // Monday
    expect(weekDays[6].day()).toBe(0) // Sunday
    // Verify correct dates
    expect(weekDays.map((d) => d.format('YYYY-MM-DD'))).toEqual([
      '2023-11-06',
      '2023-11-07',
      '2023-11-08',
      '2023-11-09',
      '2023-11-10',
      '2023-11-11',
      '2023-11-12',
    ])
  })

  it('should handle input as dayjs instance', () => {
    const date = dayjs('2023-11-08')
    const weekDays = getWeekDays(date)
    expect(weekDays[2].format('YYYY-MM-DD')).toBe('2023-11-08')
  })

  it('should handle default current date', () => {
    const weekDays = getWeekDays()
    expect(weekDays.length).toBe(7)
    expect(weekDays[0].day()).toBe(1)
    expect(weekDays[6].day()).toBe(0)
  })

  it('should handle weeks that span a month boundary', () => {
    const date = '2023-10-31' // Tuesday
    const weekDays = getWeekDays(date)
    expect(weekDays[0].format('YYYY-MM-DD')).toBe('2023-10-30') // Monday
    expect(weekDays[6].format('YYYY-MM-DD')).toBe('2023-11-05') // Sunday
  })

  it('should handle weeks that span a year boundary', () => {
    const date = '2022-12-31' // Saturday
    const weekDays = getWeekDays(date)
    expect(weekDays[0].format('YYYY-MM-DD')).toBe('2022-12-26') // Monday
    expect(weekDays[6].format('YYYY-MM-DD')).toBe('2023-01-01') // Sunday
  })

  it('should return correct day order from Monday to Sunday', () => {
    const date = '2023-11-08'
    const weekDays = getWeekDays(date)
    const days = weekDays.map((d) => d.day())
    expect(days).toEqual([1, 2, 3, 4, 5, 6, 0])
  })
})

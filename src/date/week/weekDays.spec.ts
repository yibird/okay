import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { weekDays } from './weekDays'

describe('weekDays', () => {
  it('should return 7 days for a regular mid-week date', () => {
    const date = '2023-11-08' // Wednesday
    const result = weekDays(date)
    expect(result.length).toBe(7)
    expect(result[0].day()).toBe(1) // Monday
    expect(result[6].day()).toBe(0) // Sunday
    // Verify correct dates
    expect(result.map((d) => d.format('YYYY-MM-DD'))).toEqual([
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
    const result = weekDays(date)
    expect(result[2].format('YYYY-MM-DD')).toBe('2023-11-08')
  })

  it('should handle default current date', () => {
    const result = weekDays()
    expect(result.length).toBe(7)
    expect(result[0].day()).toBe(1)
    expect(result[6].day()).toBe(0)
  })

  it('should handle weeks that span a month boundary', () => {
    const date = '2023-10-31' // Tuesday
    const result = weekDays(date)
    expect(result[0].format('YYYY-MM-DD')).toBe('2023-10-30') // Monday
    expect(result[6].format('YYYY-MM-DD')).toBe('2023-11-05') // Sunday
  })

  it('should handle weeks that span a year boundary', () => {
    const date = '2022-12-31' // Saturday
    const result = weekDays(date)
    expect(result[0].format('YYYY-MM-DD')).toBe('2022-12-26') // Monday
    expect(result[6].format('YYYY-MM-DD')).toBe('2023-01-01') // Sunday
  })

  it('should return correct day order from Monday to Sunday', () => {
    const date = '2023-11-08'
    const result = weekDays(date)
    const days = result.map((d) => d.day())
    expect(days).toEqual([1, 2, 3, 4, 5, 6, 0])
  })
})

import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { getWeekendsInWeek } from './get-weekends-in-week'

describe('getWeekendsInWeek', () => {
  it('should return default weekends [Sunday, Saturday] for a given date', () => {
    const date = '2023-11-08' // Wednesday
    const weekends = getWeekendsInWeek(date)
    expect(weekends.length).toBe(2)
    // 默认 weekStartDay = 0 (Sunday)
    expect(weekends.map((d) => d.day())).toEqual([0, 6])
    expect(weekends.map((d) => d.format('YYYY-MM-DD'))).toEqual([
      '2023-11-05', // Sunday
      '2023-11-11', // Saturday
    ])
  })

  it('should handle custom weekends [Friday, Saturday]', () => {
    const date = '2023-11-08'
    const weekends = getWeekendsInWeek(date, { weekends: [5, 6] })
    expect(weekends.map((d) => d.day())).toEqual([5, 6])
  })

  it('should handle week starting on Monday', () => {
    const date = '2023-11-08'
    const weekends = getWeekendsInWeek(date, { weekStartDay: 1 })
    // weekStartDay = 1 (Monday)，默认 weekends = [0,6] 相对于周一 => [周一+0=周一, 周一+6=周日]
    expect(weekends.map((d) => d.day())).toEqual([1, 0])
  })

  it('should handle input as dayjs instance', () => {
    const date = dayjs('2023-11-08')
    const weekends = getWeekendsInWeek(date)
    expect(weekends.map((d) => d.day())).toEqual([0, 6])
  })

  it('should handle timestamp input', () => {
    const timestamp = new Date('2023-11-08').getTime()
    const weekends = getWeekendsInWeek(timestamp)
    expect(weekends.map((d) => d.day())).toEqual([0, 6])
  })

  it('should handle default current date if no date provided', () => {
    const weekends = getWeekendsInWeek()
    expect(weekends.length).toBeGreaterThan(0)
    expect(weekends[0].startOf('day').format('HH:mm:ss')).toBe('00:00:00')
  })

  it('should return correct weekends across month boundary', () => {
    const date = '2023-10-31' // Tuesday
    const weekends = getWeekendsInWeek(date)
    expect(weekends.map((d) => d.format('YYYY-MM-DD'))).toEqual([
      '2023-10-29', // Sunday
      '2023-11-04', // Saturday
    ])
  })

  it('should return correct weekends across year boundary', () => {
    const date = '2022-12-31' // Saturday
    const weekends = getWeekendsInWeek(date)
    expect(weekends.map((d) => d.format('YYYY-MM-DD'))).toEqual([
      '2022-12-25', // Sunday
      '2022-12-31', // Saturday
    ])
  })
})

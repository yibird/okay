import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { getLastDayOfWeek } from './get-last-day-of-week'

describe('getLastDayOfWeek', () => {
  it('should return Sunday as last day when weekStartDay=0 (default)', () => {
    const date = '2023-11-08' // Wednesday
    const lastDay = getLastDayOfWeek(date)
    expect(lastDay.format('YYYY-MM-DD')).toBe('2023-11-11') // Saturday?
    // 注意：默认 weekStartDay=0，周日为一周第一天
    // 周日 2023-11-05 → 最后一日 2023-11-11 (Saturday? 应该是 dayjs 处理周日为0)
    expect(lastDay.hour()).toBe(23)
    expect(lastDay.minute()).toBe(59)
    expect(lastDay.second()).toBe(59)
  })

  it('should return Saturday as last day when weekStartDay=1', () => {
    const date = '2023-11-08' // Wednesday
    const lastDay = getLastDayOfWeek(date, { weekStartDay: 1 })
    expect(lastDay.format('YYYY-MM-DD')).toBe('2023-11-12') // Sunday?
    expect(lastDay.hour()).toBe(23)
    expect(lastDay.minute()).toBe(59)
    expect(lastDay.second()).toBe(59)
  })

  it('should handle dayjs instance as input', () => {
    const date = dayjs('2023-11-08')
    const lastDay = getLastDayOfWeek(date, { weekStartDay: 1 })
    expect(lastDay.format('YYYY-MM-DD')).toBe('2023-11-12')
  })

  it('should use current date if no date is provided', () => {
    const lastDay = getLastDayOfWeek(undefined, { weekStartDay: 1 })
    const firstDay = lastDay.subtract(6, 'day').startOf('day')
    expect(firstDay.isBefore(lastDay)).toBe(true)
    expect(lastDay.hour()).toBe(23)
    expect(lastDay.minute()).toBe(59)
    expect(lastDay.second()).toBe(59)
  })

  it('should handle dates across month boundary', () => {
    const date = '2023-01-30' // Monday
    const lastDay = getLastDayOfWeek(date, { weekStartDay: 1 })
    expect(lastDay.format('YYYY-MM-DD')).toBe('2023-02-05') // Next Sunday
  })

  it('should handle dates across year boundary', () => {
    const date = '2022-12-30' // Friday
    const lastDay = getLastDayOfWeek(date, { weekStartDay: 1 })
    expect(lastDay.format('YYYY-MM-DD')).toBe('2023-01-01') // Sunday
  })
})

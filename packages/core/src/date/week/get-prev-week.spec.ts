import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { getNextWeek } from './get-next-week'

describe('getNextWeek', () => {
  it('should return the next week range when week starts on Sunday', () => {
    const date = dayjs('2023-11-15') // Wednesday
    const [start, end] = getNextWeek(date, { weekStartDay: 0 })

    expect(start.format('YYYY-MM-DD')).toBe('2023-11-19') // Sunday
    expect(end.format('YYYY-MM-DD')).toBe('2023-11-25') // Saturday
  })

  it('should return the next week range when week starts on Monday', () => {
    const date = dayjs('2023-11-15') // Wednesday
    const [start, end] = getNextWeek(date, { weekStartDay: 1 })

    expect(start.format('YYYY-MM-DD')).toBe('2023-11-20') // Monday
    expect(end.format('YYYY-MM-DD')).toBe('2023-11-26') // Sunday
  })

  it('should return the next week range using today by default', () => {
    const today = dayjs()
    const [start, end] = getNextWeek()

    expect(start.isAfter(today)).toBe(true)
    expect(end.isAfter(today)).toBe(true)
  })
})

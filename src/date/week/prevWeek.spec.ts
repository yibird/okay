import { describe, expect, it } from 'vitest'
import dayjs from 'dayjs'
import { prevWeek } from './prevWeek'

describe('prevWeek', () => {
  it('should return the prev week range when week starts on Sunday', () => {
    const [start, end] = prevWeek(dayjs('2023-11-15'), { weekStartDay: 0 })
    expect(start.format('YYYY-MM-DD')).toBe('2023-11-05')
    expect(end.format('YYYY-MM-DD')).toBe('2023-11-11')
  })

  it('should return the prev week range when week starts on Monday', () => {
    const [start, end] = prevWeek(dayjs('2023-11-15'), { weekStartDay: 1 })
    expect(start.format('YYYY-MM-DD')).toBe('2023-11-06')
    expect(end.format('YYYY-MM-DD')).toBe('2023-11-12')
  })

  it('should return the prev week range using today by default', () => {
    const today = dayjs()
    const [start, end] = prevWeek()
    expect(start.isBefore(today)).toBe(true)
    expect(end.isBefore(today)).toBe(true)
  })
})

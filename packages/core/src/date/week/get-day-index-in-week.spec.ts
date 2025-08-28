import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { getDayIndexInWeek } from './get-day-index-in-week'

describe('getDayIndexInWeek', () => {
  it('should return 1 for Monday', () => {
    const date = '2023-11-06' // Monday
    expect(getDayIndexInWeek(date)).toBe(1)
  })

  it('should return 2 for Tuesday', () => {
    const date = '2023-11-07' // Tuesday
    expect(getDayIndexInWeek(date)).toBe(2)
  })

  it('should return 3 for Wednesday', () => {
    const date = '2023-11-08' // Wednesday
    expect(getDayIndexInWeek(date)).toBe(3)
  })

  it('should return 4 for Thursday', () => {
    const date = '2023-11-09' // Thursday
    expect(getDayIndexInWeek(date)).toBe(4)
  })

  it('should return 5 for Friday', () => {
    const date = '2023-11-10' // Friday
    expect(getDayIndexInWeek(date)).toBe(5)
  })

  it('should return 6 for Saturday', () => {
    const date = '2023-11-11' // Saturday
    expect(getDayIndexInWeek(date)).toBe(6)
  })

  it('should return 7 for Sunday', () => {
    const date = '2023-11-12' // Sunday
    expect(getDayIndexInWeek(date)).toBe(7)
  })

  it('should handle default current date', () => {
    const index = getDayIndexInWeek()
    expect(index).toBeGreaterThanOrEqual(1)
    expect(index).toBeLessThanOrEqual(7)
  })

  it('should handle invalid date gracefully', () => {
    const result = getDayIndexInWeek('invalid-date')
    // dayjs(undefined) => current date, dayjs('invalid') => Invalid Date
    // 这里函数内部没有判断 isValid，所以 dayjs('invalid').day() 返回 NaN
    expect(Number.isNaN(result)).toBe(true)
  })

  it('should handle dayjs instance as input', () => {
    const date = dayjs('2023-11-08')
    expect(getDayIndexInWeek(date)).toBe(3) // Wednesday
  })
})

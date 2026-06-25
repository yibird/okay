import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { weekdayIndex } from './weekdayIndex'

describe('weekdayIndex', () => {
  it('should return 1 for Monday', () => {
    const date = '2023-11-06' // Monday
    expect(weekdayIndex(date)).toBe(1)
  })

  it('should return 2 for Tuesday', () => {
    const date = '2023-11-07' // Tuesday
    expect(weekdayIndex(date)).toBe(2)
  })

  it('should return 3 for Wednesday', () => {
    const date = '2023-11-08' // Wednesday
    expect(weekdayIndex(date)).toBe(3)
  })

  it('should return 4 for Thursday', () => {
    const date = '2023-11-09' // Thursday
    expect(weekdayIndex(date)).toBe(4)
  })

  it('should return 5 for Friday', () => {
    const date = '2023-11-10' // Friday
    expect(weekdayIndex(date)).toBe(5)
  })

  it('should return 6 for Saturday', () => {
    const date = '2023-11-11' // Saturday
    expect(weekdayIndex(date)).toBe(6)
  })

  it('should return 7 for Sunday', () => {
    const date = '2023-11-12' // Sunday
    expect(weekdayIndex(date)).toBe(7)
  })

  it('should handle default current date', () => {
    const index = weekdayIndex()
    expect(index).toBeGreaterThanOrEqual(1)
    expect(index).toBeLessThanOrEqual(7)
  })

  it('should handle invalid date gracefully', () => {
    const result = weekdayIndex('invalid-date')
    expect(Number.isNaN(result)).toBe(true)
  })

  it('should handle dayjs instance as input', () => {
    const date = dayjs('2023-11-08')
    expect(weekdayIndex(date)).toBe(3) // Wednesday
  })
})

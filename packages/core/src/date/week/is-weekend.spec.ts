import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { isWeekend } from './is-weekend'

describe('isWeekend', () => {
  it('should return true for Saturday', () => {
    const date = '2023-11-04' // Saturday
    expect(isWeekend(date)).toBe(true)
  })

  it('should return true for Sunday', () => {
    const date = '2023-11-05' // Sunday
    expect(isWeekend(date)).toBe(true)
  })

  it('should return false for Monday', () => {
    const date = '2023-11-06' // Monday
    expect(isWeekend(date)).toBe(false)
  })

  it('should return false for Tuesday', () => {
    const date = '2023-11-07' // Tuesday
    expect(isWeekend(date)).toBe(false)
  })

  it('should return false for Wednesday', () => {
    const date = '2023-11-08' // Wednesday
    expect(isWeekend(date)).toBe(false)
  })

  it('should return false for Thursday', () => {
    const date = '2023-11-09' // Thursday
    expect(isWeekend(date)).toBe(false)
  })

  it('should return false for Friday', () => {
    const date = '2023-11-10' // Friday
    expect(isWeekend(date)).toBe(false)
  })

  it('should return true for timestamp input on weekend', () => {
    const timestamp = new Date('2023-11-04').getTime() // Saturday
    expect(isWeekend(timestamp)).toBe(true)
  })

  it('should return false for dayjs instance on weekday', () => {
    const date = dayjs('2023-11-08') // Wednesday
    expect(isWeekend(date)).toBe(false)
  })

  it('should return true for current date if today is weekend', () => {
    const today = dayjs()
    const expected = today.day() === 0 || today.day() === 6
    expect(isWeekend()).toBe(expected)
  })

  it('should handle invalid date input gracefully', () => {
    expect(isWeekend('invalid-date')).toBe(false)
  })

  it('should handle cross-year dates correctly', () => {
    expect(isWeekend('2023-12-30')).toBe(true) // Saturday
    expect(isWeekend('2023-12-31')).toBe(true) // Sunday
    expect(isWeekend('2024-01-01')).toBe(false) // Monday
  })

  it('should handle leap year dates correctly', () => {
    expect(isWeekend('2024-02-29')).toBe(false) // Thursday
  })
})

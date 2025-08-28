import dayjs from 'dayjs'
import { describe, expect, test } from 'vitest'
import { getDayName } from './get-day-name'

describe('getDayName', () => {
  test('should return correct day name', () => {
    expect(getDayName(0)).toBe('Sunday')
    expect(getDayName(1)).toBe('Monday')
    expect(getDayName(2)).toBe('Tuesday')
    expect(getDayName(3)).toBe('Wednesday')
    expect(getDayName(4)).toBe('Thursday')
    expect(getDayName(5)).toBe('Friday')
    expect(getDayName(6)).toBe('Saturday')
  })

  test('should handle dayjs objects', () => {
    const date = dayjs('2023-06-15') // Thursday
    expect(getDayName(date)).toBe('Thursday')
  })

  test('should handle invalid day numbers by wrapping', () => {
    expect(getDayName(7)).toBe('Sunday')
    expect(getDayName(-1)).toBe('Saturday')
  })

  test('should use current day if no input provided', () => {
    const currentDayName = getDayName()
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    expect(dayNames).toContain(currentDayName)
  })
})

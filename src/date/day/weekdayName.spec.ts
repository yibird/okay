import dayjs from 'dayjs'
import { describe, expect, test } from 'vitest'
import { weekdayName } from './weekdayName'

describe('weekdayName', () => {
  test('should return correct day name', () => {
    expect(weekdayName(0)).toBe('Sunday')
    expect(weekdayName(1)).toBe('Monday')
    expect(weekdayName(2)).toBe('Tuesday')
    expect(weekdayName(3)).toBe('Wednesday')
    expect(weekdayName(4)).toBe('Thursday')
    expect(weekdayName(5)).toBe('Friday')
    expect(weekdayName(6)).toBe('Saturday')
  })

  test('should handle dayjs objects', () => {
    const date = dayjs('2023-06-15') // Thursday
    expect(weekdayName(date)).toBe('Thursday')
  })

  test('should handle invalid day numbers by wrapping', () => {
    expect(weekdayName(7)).toBe('Sunday')
    expect(weekdayName(-1)).toBe('Saturday')
  })

  test('returns current day name when no argument provided', () => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    expect(dayNames).toContain(weekdayName())
  })

  test('falls back to current day for non-number non-Dayjs input', () => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    expect(dayNames).toContain((weekdayName as any)('invalid'))
  })
})

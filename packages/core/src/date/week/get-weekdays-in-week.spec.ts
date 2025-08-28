import dayjs from 'dayjs'
import { describe, expect, test } from 'vitest'
import { getWeekdaysInWeek } from './get-weekdays-in-week'

describe('getWeekdaysInWeek', () => {
  test('should return weekdays in a week', () => {
    const date = dayjs('2023-06-15') // Thursday
    const weekdays = getWeekdaysInWeek(date)
    expect(weekdays.length).toBe(5)
    expect(weekdays[0].format('YYYY-MM-DD')).toBe('2023-06-12') // Monday
    expect(weekdays[1].format('YYYY-MM-DD')).toBe('2023-06-13') // Tuesday
    expect(weekdays[2].format('YYYY-MM-DD')).toBe('2023-06-14') // Wednesday
    expect(weekdays[3].format('YYYY-MM-DD')).toBe('2023-06-15') // Thursday
    expect(weekdays[4].format('YYYY-MM-DD')).toBe('2023-06-16') // Friday
  })

  test('should handle custom weekdays', () => {
    // Consider Monday and Tuesday as weekdays
    const date = dayjs('2023-06-15')
    const weekdays = getWeekdaysInWeek(date, { weekdays: [1, 2] })
    expect(weekdays.length).toBe(2)
    expect(weekdays[0].format('YYYY-MM-DD')).toBe('2023-06-12') // Monday
    expect(weekdays[1].format('YYYY-MM-DD')).toBe('2023-06-13') // Tuesday
  })

  test('should use current date if no date provided', () => {
    const weekdays = getWeekdaysInWeek()
    expect(weekdays.length).toBe(5)
  })

  test('should handle custom week start day', () => {
    // Week starts on Sunday
    const date = dayjs('2023-06-15')
    const weekdays = getWeekdaysInWeek(date, { weekStartDay: 0 })
    expect(weekdays[0].format('YYYY-MM-DD')).toBe('2023-06-12') // Monday
  })
})

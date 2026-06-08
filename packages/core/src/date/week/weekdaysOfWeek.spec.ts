import dayjs from 'dayjs'
import { describe, expect, test } from 'vitest'
import { weekdaysOfWeek } from './weekdaysOfWeek'

describe('weekdaysOfWeek', () => {
  test('should return weekdays in a week', () => {
    const date = dayjs('2023-06-15')
    const weekdays = weekdaysOfWeek(date)

    expect(weekdays.length).toBe(5)
    expect(weekdays.map((day) => day.format('YYYY-MM-DD'))).toEqual([
      '2023-06-12',
      '2023-06-13',
      '2023-06-14',
      '2023-06-15',
      '2023-06-16',
    ])
  })

  test('should handle custom weekdays', () => {
    const date = dayjs('2023-06-15')
    const weekdays = weekdaysOfWeek(date, { weekdays: [1, 2] })

    expect(weekdays.map((day) => day.format('YYYY-MM-DD'))).toEqual(['2023-06-12', '2023-06-13'])
  })

  test('should use current date if no date provided', () => {
    const weekdays = weekdaysOfWeek()

    expect(weekdays.length).toBe(5)
  })

  test('should keep weekday numbers semantic when week starts on Monday', () => {
    const date = dayjs('2023-06-15')
    const weekdays = weekdaysOfWeek(date, { weekStartDay: 1, weekdays: [0, 6] })

    expect(weekdays.map((day) => day.day())).toEqual([0, 6])
    expect(weekdays.map((day) => day.format('YYYY-MM-DD'))).toEqual(['2023-06-18', '2023-06-17'])
  })

  test('should throw for invalid weekday values', () => {
    expect(() => weekdaysOfWeek('2023-06-15', { weekdays: [7] })).toThrow(
      'weekdays must contain integers from 0 (Sunday) to 6 (Saturday)',
    )
  })
})

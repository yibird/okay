import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import { getCurrentWeekRange } from './get-current-week-range'

describe('getCurrentWeekRange', () => {
  it('should return current week range when no date provided (default weekStartDay=0)', () => {
    const [start, end] = getCurrentWeekRange()
    expect(start.isSame(end, 'week')).toBe(true)
    expect(end.diff(start, 'day')).toBe(6)
  })

  it('should calculate week range with weekStartDay=0 (Sunday start)', () => {
    const date = dayjs('2023-11-01') // Wednesday
    const [start, end] = getCurrentWeekRange(date, { weekStartDay: 0 })
    expect(start.format('YYYY-MM-DD')).toBe('2023-10-29') // Sunday
    expect(end.format('YYYY-MM-DD')).toBe('2023-11-04') // Saturday
  })

  it('should calculate week range with weekStartDay=1 (Monday start)', () => {
    const date = dayjs('2023-11-01') // Wednesday
    const [start, end] = getCurrentWeekRange(date, { weekStartDay: 1 })
    expect(start.format('YYYY-MM-DD')).toBe('2023-10-30') // Monday
    expect(end.format('YYYY-MM-DD')).toBe('2023-11-05') // Sunday
  })

  it('should handle start of month correctly', () => {
    const date = dayjs('2023-09-01') // Friday
    const [start, end] = getCurrentWeekRange(date, { weekStartDay: 1 })
    expect(start.format('YYYY-MM-DD')).toBe('2023-08-28')
    expect(end.format('YYYY-MM-DD')).toBe('2023-09-03')
  })

  it('should handle end of month correctly', () => {
    const date = dayjs('2023-09-30') // Saturday
    const [start, end] = getCurrentWeekRange(date, { weekStartDay: 0 })
    expect(start.format('YYYY-MM-DD')).toBe('2023-09-24')
    expect(end.format('YYYY-MM-DD')).toBe('2023-09-30')
  })

  it('should handle year cross (Dec -> Jan)', () => {
    const date = dayjs('2022-12-31') // Saturday
    const [start, end] = getCurrentWeekRange(date, { weekStartDay: 0 })
    expect(start.format('YYYY-MM-DD')).toBe('2022-12-25')
    expect(end.format('YYYY-MM-DD')).toBe('2022-12-31')
  })

  it('should handle leap year (2024-02-29)', () => {
    const date = dayjs('2024-02-29') // Thursday
    const [start, end] = getCurrentWeekRange(date, { weekStartDay: 1 })
    expect(start.format('YYYY-MM-DD')).toBe('2024-02-26')
    expect(end.format('YYYY-MM-DD')).toBe('2024-03-03')
  })

  it('should return correct type (dayjs instance)', () => {
    const [start, end] = getCurrentWeekRange('2023-07-15')
    expect(dayjs.isDayjs(start)).toBe(true)
    expect(dayjs.isDayjs(end)).toBe(true)
  })
})

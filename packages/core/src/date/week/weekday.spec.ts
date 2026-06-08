import { describe, expect, it } from 'vitest'
import { weekday } from './weekday'

describe('weekday', () => {
  it('should return undefined for invalid date', () => {
    expect(weekday('invalid-date')).toBeUndefined()
  })

  it('should default to today with zh full style', () => {
    expect(weekday()).toBeTypeOf('string')
  })

  it('should return English full names', () => {
    const cases: Array<[string, string]> = [
      ['2023-11-05', 'Sunday'],
      ['2023-11-06', 'Monday'],
      ['2023-11-07', 'Tuesday'],
      ['2023-11-08', 'Wednesday'],
      ['2023-11-09', 'Thursday'],
      ['2023-11-10', 'Friday'],
      ['2023-11-11', 'Saturday'],
    ]

    for (const [date, expected] of cases) {
      expect(weekday(date, 'en', 'full')).toBe(expected)
    }
  })

  it('should return English short names', () => {
    const cases: Array<[string, string]> = [
      ['2023-11-05', 'Sun'],
      ['2023-11-06', 'Mon'],
      ['2023-11-07', 'Tue'],
      ['2023-11-08', 'Wed'],
      ['2023-11-09', 'Thu'],
      ['2023-11-10', 'Fri'],
      ['2023-11-11', 'Sat'],
    ]

    for (const [date, expected] of cases) {
      expect(weekday(date, 'en', 'short')).toBe(expected)
    }
  })

  it('should return Chinese full names', () => {
    const cases: Array<[string, string]> = [
      ['2023-11-05', '星期日'],
      ['2023-11-06', '星期一'],
      ['2023-11-07', '星期二'],
      ['2023-11-08', '星期三'],
      ['2023-11-09', '星期四'],
      ['2023-11-10', '星期五'],
      ['2023-11-11', '星期六'],
    ]

    for (const [date, expected] of cases) {
      expect(weekday(date, 'zh', 'full')).toBe(expected)
    }
  })

  it('should return Chinese short names', () => {
    const cases: Array<[string, string]> = [
      ['2023-11-05', '周日'],
      ['2023-11-06', '周一'],
      ['2023-11-07', '周二'],
      ['2023-11-08', '周三'],
      ['2023-11-09', '周四'],
      ['2023-11-10', '周五'],
      ['2023-11-11', '周六'],
    ]

    for (const [date, expected] of cases) {
      expect(weekday(date, 'zh', 'short')).toBe(expected)
    }
  })
})

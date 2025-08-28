import { describe, it, expect } from 'vitest'
import { getDayOfWeek } from './get-day-of-week'

describe('getDayOfWeek', () => {
  it('should return undefined for invalid date', () => {
    expect(getDayOfWeek('invalid-date')).toBeUndefined()
  })

  it('should default to today with zh full', () => {
    const result = getDayOfWeek()
    expect(typeof result).toBe('string')
    expect(result).toMatch(/^星期|周/) // 中文返回值
  })

  it('should return correct English full week names', () => {
    const cases: Array<[string, string]> = [
      ['2023-11-05', 'Sunday'],
      ['2023-11-06', 'Monday'],
      ['2023-11-07', 'Tuesday'],
      ['2023-11-08', 'Wednesday'],
      ['2023-11-09', 'Thursday'],
      ['2023-11-10', 'Friday'],
      ['2023-11-11', 'Saturday'],
    ]

    cases.forEach(([date, expected]) => {
      expect(getDayOfWeek(date, 'en', 'full')).toBe(expected)
    })
  })

  it('should return correct English short week names', () => {
    const cases: Array<[string, string]> = [
      ['2023-11-05', 'Sun'],
      ['2023-11-06', 'Mon'],
      ['2023-11-07', 'Tue'],
      ['2023-11-08', 'Wed'],
      ['2023-11-09', 'Thu'],
      ['2023-11-10', 'Fri'],
      ['2023-11-11', 'Sat'],
    ]

    cases.forEach(([date, expected]) => {
      expect(getDayOfWeek(date, 'en', 'short')).toBe(expected)
    })
  })

  it('should return correct Chinese full week names', () => {
    const cases: Array<[string, string]> = [
      ['2023-11-05', '星期日'],
      ['2023-11-06', '星期一'],
      ['2023-11-07', '星期二'],
      ['2023-11-08', '星期三'],
      ['2023-11-09', '星期四'],
      ['2023-11-10', '星期五'],
      ['2023-11-11', '星期六'],
    ]

    cases.forEach(([date, expected]) => {
      expect(getDayOfWeek(date, 'zh', 'full')).toBe(expected)
    })
  })

  it('should return correct Chinese short week names', () => {
    const cases: Array<[string, string]> = [
      ['2023-11-05', '周日'],
      ['2023-11-06', '周一'],
      ['2023-11-07', '周二'],
      ['2023-11-08', '周三'],
      ['2023-11-09', '周四'],
      ['2023-11-10', '周五'],
      ['2023-11-11', '周六'],
    ]

    cases.forEach(([date, expected]) => {
      expect(getDayOfWeek(date, 'zh', 'short')).toBe(expected)
    })
  })

  it('should handle edge dates correctly', () => {
    expect(getDayOfWeek('1970-01-01', 'en', 'full')).toBe('Thursday')
    expect(getDayOfWeek('1970-01-01', 'zh', 'short')).toBe('周四')
    expect(getDayOfWeek('2024-02-29', 'en', 'short')).toBe('Thu')
    expect(getDayOfWeek('2024-02-29', 'zh', 'full')).toBe('星期四')
    expect(getDayOfWeek('2099-12-31', 'zh', 'short')).toBe('周四')
  })
})

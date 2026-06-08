import dayjs from 'dayjs'
import { describe, expect, test } from 'vitest'
import { weekdayNameZh } from './weekdayNameZh'

const dayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

describe('weekdayNameZh', () => {
  test('should return correct day name', () => {
    expect(weekdayNameZh(0)).toBe('星期日')
    expect(weekdayNameZh(1)).toBe('星期一')
    expect(weekdayNameZh(2)).toBe('星期二')
    expect(weekdayNameZh(3)).toBe('星期三')
    expect(weekdayNameZh(4)).toBe('星期四')
    expect(weekdayNameZh(5)).toBe('星期五')
    expect(weekdayNameZh(6)).toBe('星期六')
  })

  test('should handle dayjs objects', () => {
    expect(weekdayNameZh(dayjs('2023-06-15'))).toBe('星期四')
  })

  test('should handle invalid day numbers by wrapping', () => {
    expect(weekdayNameZh(7)).toBe('星期日')
    expect(weekdayNameZh(-1)).toBe('星期六')
  })

  test('returns current day name when no argument provided', () => {
    expect(dayNames).toContain(weekdayNameZh())
  })

  test('falls back to current day for non-number non-Dayjs input', () => {
    expect(dayNames).toContain((weekdayNameZh as any)('invalid'))
  })
})

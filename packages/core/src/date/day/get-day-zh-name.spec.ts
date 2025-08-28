import dayjs from 'dayjs'
import { describe, expect, test } from 'vitest'
import { getDayZhName } from './get-day-zh-name'

describe('getDayZhName', () => {
  test('should return correct day name', () => {
    expect(getDayZhName(0)).toBe('星期日')
    expect(getDayZhName(1)).toBe('星期一')
    expect(getDayZhName(2)).toBe('星期二')
    expect(getDayZhName(3)).toBe('星期三')
    expect(getDayZhName(4)).toBe('星期四')
    expect(getDayZhName(5)).toBe('星期五')
    expect(getDayZhName(6)).toBe('星期六')
  })

  test('should handle dayjs objects', () => {
    const date = dayjs('2023-06-15') // Thursday
    expect(getDayZhName(date)).toBe('星期四')
  })

  test('should handle invalid day numbers by wrapping', () => {
    expect(getDayZhName(7)).toBe('星期日')
    expect(getDayZhName(-1)).toBe('星期六')
  })

  test('should use current day if no input provided', () => {
    const currentDayName = getDayZhName()
    const dayNames = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ]
    expect(dayNames).toContain(currentDayName)
  })
})

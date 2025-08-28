import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { getWeekRange } from './get-week-range'
import { isDateInWeek } from './is-date-in-week'

describe('isDateInWeek', () => {
  // 以2023-06-15（周四）作为参考周
  const referenceWeek = '2023-06-15' // 这一周是 2023-06-12（周一）到 2023-06-18（周日）

  it('should return true for dates within the reference week', () => {
    // 本周内的日期
    expect(isDateInWeek('2023-06-12', referenceWeek)).toBe(true) // 周一
    expect(isDateInWeek('2023-06-15', referenceWeek)).toBe(true) // 周四
    expect(isDateInWeek('2023-06-18', referenceWeek)).toBe(true) // 周日
    expect(isDateInWeek('2023-06-14', referenceWeek)).toBe(true) // 周三
  })

  it('should return false for dates outside the reference week', () => {
    // 上周和下周的日期
    expect(isDateInWeek('2023-06-11', referenceWeek)).toBe(false) // 上周日
    expect(isDateInWeek('2023-06-19', referenceWeek)).toBe(false) // 下周一
    expect(isDateInWeek('2023-06-05', referenceWeek)).toBe(false) // 上周一
    expect(isDateInWeek('2023-06-25', referenceWeek)).toBe(false) // 下周日
  })

  it('should use current week when no reference date is provided', () => {
    const today = dayjs()
    const { startTime, endTime } = getWeekRange()

    // 测试今天是否在当前周
    expect(isDateInWeek(today)).toBe(true)

    // 测试本周边界
    expect(isDateInWeek(startTime)).toBe(true)
    expect(isDateInWeek(endTime)).toBe(true)

    // 测试非本周日期
    expect(isDateInWeek(startTime.subtract(1, 'day'))).toBe(false)
    expect(isDateInWeek(endTime.add(1, 'day'))).toBe(false)
  })

  it('should handle different date formats', () => {
    // 各种日期格式
    expect(isDateInWeek(new Date('2023-06-15'), referenceWeek)).toBe(true)
    expect(isDateInWeek(dayjs('2023-06-16'), referenceWeek)).toBe(true)
    expect(isDateInWeek('2023-06-17', referenceWeek)).toBe(true)
    expect(isDateInWeek(1686960000000, referenceWeek)).toBe(true) // 2023-06-16的timestamp
  })

  it('should handle week spanning month boundaries', () => {
    // 跨月的周
    const monthBoundaryWeek = '2023-05-31' // 这周是 2023-05-29 到 2023-06-04

    // 五月日期
    expect(isDateInWeek('2023-05-29', monthBoundaryWeek)).toBe(true)
    // 六月日期
    expect(isDateInWeek('2023-06-03', monthBoundaryWeek)).toBe(true)
    // 非本周日期
    expect(isDateInWeek('2023-05-28', monthBoundaryWeek)).toBe(false)
    expect(isDateInWeek('2023-06-05', monthBoundaryWeek)).toBe(false)
  })

  it('should return false for invalid dates', () => {
    // 无效日期
    expect(isDateInWeek('invalid-date', referenceWeek)).toBe(false)
    expect(isDateInWeek('', referenceWeek)).toBe(false)
    expect(isDateInWeek(null, referenceWeek)).toBe(false)
    expect(isDateInWeek(undefined, referenceWeek)).toBe(false)
  })
})

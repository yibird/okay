import type dayjs from 'dayjs'
import { daysInMonth as getDaysInMonth } from './daysInMonth'
import { startOfMonth } from './startOfMonth'

/**
 * 返回某个月的每一个日历日。
 *
 * `month` 使用人类可读编号：`1` 表示一月，`12` 表示十二月。
 * 返回值按从月初到月末排序。
 *
 * @param year 完整年份，例如 `2024`。
 * @param month `1...12` 范围内的月份数字。
 * @returns 该月所有日期对应的 Day.js 值。
 */
export function daysOfMonth(year: number, month: number): dayjs.Dayjs[] {
  const days: dayjs.Dayjs[] = []
  const date = startOfMonth(year, month)
  const count = getDaysInMonth(year, month)

  for (let index = 0; index < count; index++) {
    days.push(date.add(index, 'day'))
  }

  return days
}

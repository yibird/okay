import type { Dayjs } from 'dayjs'
import { daysInMonth } from './daysInMonth'
import { startOfMonth } from './startOfMonth'

/**
 * 返回某个月内所有周六和周日日期。
 *
 * `month` 使用人类可读编号：`1` 表示一月，`12` 表示十二月。
 *
 * @param year 完整年份，例如 `2024`。
 * @param month `1...12` 范围内的月份数字。
 * @returns 按日历升序排列的周末日期。
 */
export function weekendsOfMonth(year: number, month: number): Dayjs[] {
  const result: Dayjs[] = []
  const start = startOfMonth(year, month)
  const count = daysInMonth(year, month)
  for (let index = 0; index < count; index++) {
    const day = start.add(index, 'day')
    const dow = day.day()
    if (dow === 0 || dow === 6) result.push(day)
  }
  return result
}

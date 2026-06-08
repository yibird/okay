import { daysInMonth as getDaysInMonth } from './daysInMonth'
import { endOfMonth } from './endOfMonth'
import { startOfMonth } from './startOfMonth'

/**
 * 计算展示某个月需要多少行日历周。
 *
 * `month` 使用人类可读编号：`1` 表示一月，`12` 表示十二月。
 * `startOfWeek` 遵循 JavaScript 星期编号：周日为 `0`，周六为 `6`。
 *
 * @param year 完整年份，例如 `2024`。
 * @param month `1...12` 范围内的月份数字。
 * @param startOfWeek 日历网格的每周起始日。
 * @returns Number of week rows containing at least one day of the month.
 * @throws When `startOfWeek` is outside `0...6`.
 */
export function weeksOfMonth(year: number, month: number, startOfWeek = 0): number {
  if (!Number.isInteger(startOfWeek) || startOfWeek < 0 || startOfWeek > 6) {
    throw new Error('startOfWeek must be between 0 (Sunday) and 6 (Saturday)')
  }

  const firstDay = startOfMonth(year, month)
  const lastDay = endOfMonth(year, month)
  const firstDayOfWeek = firstDay.day()
  const lastDayOfWeek = lastDay.day()
  const count = getDaysInMonth(year, month)

  let adjustedFirstDay = firstDayOfWeek - startOfWeek
  if (adjustedFirstDay < 0) adjustedFirstDay += 7

  let adjustedLastDay = lastDayOfWeek - startOfWeek
  if (adjustedLastDay < 0) adjustedLastDay += 7

  return Math.ceil((adjustedFirstDay + count) / 7)
}

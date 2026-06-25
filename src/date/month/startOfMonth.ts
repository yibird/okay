import dayjs, { type Dayjs } from 'dayjs'
import { assertValidYearMonth } from './monthShared'

/**
 * 返回某个月的第一天。
 *
 * `month` 使用人类可读编号：`1` 表示一月，`12` 表示十二月。
 *
 * @param year 完整年份，例如 `2024`。
 * @param month `1...12` 范围内的月份数字。
 * @returns 该月第一天开始时刻的 Day.js 值。
 */
export function startOfMonth(year: number, month: number): Dayjs {
  assertValidYearMonth(year, month)
  return dayjs(new Date(year, month - 1, 1)).startOf('month')
}

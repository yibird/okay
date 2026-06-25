import dayjs, { type Dayjs } from 'dayjs'
import { assertValidYearMonth } from './monthShared'

/**
 * 返回某个月的最后一刻。
 *
 * `month` 使用人类可读编号：`1` 表示一月，`12` 表示十二月。
 *
 * @param year 完整年份，例如 `2024`。
 * @param month `1...12` 范围内的月份数字。
 * @returns 该月最后一天结束时刻的 Day.js 值。
 */
export function endOfMonth(year: number, month: number): Dayjs {
  assertValidYearMonth(year, month)
  return dayjs(new Date(year, month - 1, 1)).endOf('month')
}

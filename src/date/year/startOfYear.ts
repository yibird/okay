import dayjs, { type Dayjs } from 'dayjs'
import { assertValidYear } from '../month/monthShared'

/**
 * 返回某一年的第一刻。
 *
 * @param year 完整年份，例如 `2024`。
 * @returns 该年 1 月 1 日开始时刻的 Day.js 值。
 * @throws 当 `year` 不是整数时抛出错误。
 */
export function startOfYear(year: number): Dayjs {
  assertValidYear(year)
  return dayjs().year(year).startOf('year')
}

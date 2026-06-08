import dayjs, { type Dayjs } from 'dayjs'

/**
 * 返回某一年的最后一刻。
 *
 * @param year 完整年份，例如 `2024`。
 * @returns 该年 12 月 31 日结束时刻的 Day.js 值。
 */
export function endOfYear(year: number): Dayjs {
  return dayjs().year(year).endOf('year')
}

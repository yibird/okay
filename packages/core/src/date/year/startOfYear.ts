import dayjs, { type Dayjs } from 'dayjs'

/**
 * 返回某一年的第一刻。
 *
 * @param year 完整年份，例如 `2024`。
 * @returns 该年 1 月 1 日开始时刻的 Day.js 值。
 */
export function startOfYear(year: number): Dayjs {
  return dayjs().year(year).startOf('year')
}

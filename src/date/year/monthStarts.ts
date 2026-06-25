import dayjs, { type Dayjs } from 'dayjs'

/**
 * 返回某一年每个月的第一天。
 *
 * 返回值按一月至十二月排序，并归一化到每个月的开始时刻。
 *
 * @param year 完整年份，例如 `2024`。
 * @returns 十二个表示月初的 Day.js 值。
 */
export function monthStarts(year: number): Dayjs[] {
  return Array.from({ length: 12 }, (_, index) => dayjs(new Date(year, index, 1)).startOf('month'))
}

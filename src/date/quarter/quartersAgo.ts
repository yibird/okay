import dayjs from 'dayjs'
import type { QuarterRange } from './types'

/**
 * 返回 `date` 往前 `n` 个季度的范围。
 *
 * `n = 0` 会返回包含 `date` 的当前季度。
 *
 * @param n 需要向前移动的季度数，必须为非负数。
 * @param date 参考日期，默认当前日期。
 * @returns 目标季度的开始和结束时间。
 * @throws 当 `n` 为负数时抛出错误。
 */
export function quartersAgo(n: number, date?: dayjs.ConfigType): QuarterRange {
  if (n < 0) {
    throw new Error('Number of quarters must be a positive integer')
  }

  const d = date === undefined || date === null || date === '' ? dayjs() : dayjs(date)
  const currentQuarter = Math.floor(d.month() / 3)
  const totalQuarters = currentQuarter - n
  const targetYear = d.year() + Math.floor(totalQuarters / 4)
  const targetQuarter = ((totalQuarters % 4) + 4) % 4
  const startMonth = targetQuarter * 3
  const startTime = dayjs(d).year(targetYear).month(startMonth).startOf('month')
  const endTime = startTime.add(2, 'month').endOf('month')

  return { startTime, endTime }
}

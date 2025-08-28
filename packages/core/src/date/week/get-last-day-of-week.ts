import { getFirstDayOfWeek } from './get-first-day-of-week'
import type { Dayjs } from 'dayjs'

/**
 * 获取一周的最后一天
 * @param date 可选的日期，如果不提供则使用当前日期
 * @param options 可选的配置项
 * @param options.weekStartDay 周的开始日，0 表示星期日，1 表示星期一，默认为 0
 * @returns 一周的最后一天的 Dayjs 对象，时间部分为 23:59:59
 */
export function getLastDayOfWeek(
  date?: Dayjs | string | number,
  options: { weekStartDay?: number } = {},
): Dayjs {
  // 获取一周的第一天，然后加 6 天得到最后一天
  return getFirstDayOfWeek(date, options).add(6, 'day').endOf('day')
}

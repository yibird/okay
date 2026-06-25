import type { ConfigType, Dayjs } from 'dayjs'
import { startOfWeek } from './startOfWeek'

/**
 * 返回包含 `date` 的周结束时刻。
 *
 * @param date 参考日期，默认当前日期。
 * @param options 周起始日配置。
 * @returns 该周最后一天 `23:59:59.999` 的 Day.js 值。
 * @throws 当 `date` 或 `weekStartDay` 无效时抛出错误。
 */
export function endOfWeek(date?: ConfigType, options: { weekStartDay?: number } = {}): Dayjs {
  return startOfWeek(date, options).add(6, 'day').endOf('day')
}

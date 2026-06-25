import dayjs, { type Dayjs } from 'dayjs'
import { endOfWeek } from './endOfWeek'
import { startOfWeek } from './startOfWeek'

/**
 * 返回包含 `date` 的上一周范围。
 *
 * @param date 参考日期，默认当前日期。
 * @param options 周起始日配置。
 * @returns 包含上一周开始和结束的元组。
 * @throws 当 `date` 或 `weekStartDay` 无效时抛出错误。
 */
export function prevWeek(
  date?: dayjs.ConfigType,
  options: { weekStartDay?: 0 | 1 } = {},
): [Dayjs, Dayjs] {
  const currentDate = date === undefined ? dayjs() : dayjs(date)
  const previousWeekFirstDay = startOfWeek(currentDate, options).subtract(7, 'day')
  return [previousWeekFirstDay, endOfWeek(previousWeekFirstDay, options)]
}

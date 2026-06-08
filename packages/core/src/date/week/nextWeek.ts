import dayjs, { type Dayjs } from 'dayjs'
import { endOfWeek } from './endOfWeek'
import { startOfWeek } from './startOfWeek'

/**
 * 返回包含 `date` 的下一周范围。
 *
 * @param date 参考日期，默认当前日期。
 * @param options 周起始日配置。
 * @returns 包含下一周开始和结束的元组。
 * @throws 当 `date` 或 `weekStartDay` 无效时抛出错误。
 */
export function nextWeek(
  date?: dayjs.ConfigType,
  options: { weekStartDay?: 0 | 1 } = {},
): [Dayjs, Dayjs] {
  const currentDate = date === undefined ? dayjs() : dayjs(date)
  const nextWeekFirstDay = startOfWeek(currentDate, options).add(7, 'day')
  return [nextWeekFirstDay, endOfWeek(nextWeekFirstDay, options)]
}

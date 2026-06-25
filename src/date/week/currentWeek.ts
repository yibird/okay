import dayjs, { type Dayjs } from 'dayjs'
import { endOfWeek } from './endOfWeek'
import { startOfWeek } from './startOfWeek'

/**
 * 周边界计算配置。
 */
export interface WeekBoundaryOptions {
  /**
   * 范围的每周起始日，周日为 `0`，周一为 `1`。
   */
  weekStartDay?: 0 | 1
}

/**
 * 返回包含 `date` 的周范围。
 *
 * @param date 参考日期，默认当前日期。
 * @param options 周起始日配置。
 * @returns 包含周开始和周结束的元组。
 * @throws 当 `date` 或 `weekStartDay` 无效时抛出错误。
 */
export function currentWeek(
  date?: dayjs.ConfigType,
  options: WeekBoundaryOptions = {},
): [Dayjs, Dayjs] {
  const currentDate = date === undefined ? dayjs() : dayjs(date)
  return [startOfWeek(currentDate, options), endOfWeek(currentDate, options)]
}

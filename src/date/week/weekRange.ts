import dayjs, { type Dayjs } from 'dayjs'
import { endOfWeek } from './endOfWeek'
import { startOfWeek } from './startOfWeek'

/**
 * 周范围。
 */
export interface WeekRange {
  startTime: Dayjs
  endTime: Dayjs
}

/**
 * 返回包含 `date` 的周一到周日范围。
 *
 * 返回值会归一化到周一开始时刻和周日结束时刻。
 *
 * @param date 参考日期，默认当前日期。
 * @returns 周开始和周结束。
 * @throws 当 `date` 无效时抛出错误。
 */
export function weekRange(date?: dayjs.ConfigType): WeekRange {
  const currentDate = date === undefined ? dayjs() : dayjs(date)
  return {
    startTime: startOfWeek(currentDate, { weekStartDay: 1 }),
    endTime: endOfWeek(currentDate, { weekStartDay: 1 }),
  }
}

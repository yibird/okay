import dayjs, { type Dayjs } from 'dayjs'
import { startOfWeek } from './startOfWeek'

/**
 * 获取一周内指定工作日的配置。
 */
export interface WeekdaysOfWeekOptions {
  /**
   * 每周起始日，周日为 `0`，周一为 `1`。
   */
  weekStartDay?: 0 | 1
  /**
   * 需要返回的星期数字，周日为 `0`，周六为 `6`。
   */
  weekdays?: number[]
}

const toOffsetFromWeekStart = (weekday: number, weekStartDay: number): number => {
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
    throw new Error('weekdays must contain integers from 0 (Sunday) to 6 (Saturday)')
  }

  return (weekday - weekStartDay + 7) % 7
}

/**
 * 返回包含 `date` 的一周内指定星期日期。
 *
 * `weekdays` 使用真实 JavaScript 星期编号：周日为 `0`，周六为 `6`，而不是相对周起始日的偏移。
 * 返回日期遵循输入 `weekdays` 顺序，并归一化到当天开始时刻。
 *
 * @param date 参考日期，默认当前日期。
 * @param options 周起始日和星期选择配置。
 * @returns 位于目标周内的选中日期。
 * @throws 当星期值不在 `0...6` 范围内时抛出错误。
 */
export function weekdaysOfWeek(
  date?: dayjs.ConfigType,
  options: WeekdaysOfWeekOptions = {},
): Dayjs[] {
  const { weekStartDay = 0, weekdays = [1, 2, 3, 4, 5] } = options
  const weekFirstDay = startOfWeek(date, { weekStartDay })

  return weekdays.map((weekday) =>
    weekFirstDay.add(toOffsetFromWeekStart(weekday, weekStartDay), 'day').startOf('day'),
  )
}

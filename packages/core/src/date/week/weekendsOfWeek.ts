import dayjs, { type Dayjs } from 'dayjs'
import { startOfWeek } from './startOfWeek'

/**
 * 获取一周内周末日期的配置。
 */
export interface WeekendsOfWeekOptions {
  /**
   * 每周起始日，周日为 `0`，周一为 `1`。
   */
  weekStartDay?: 0 | 1
  /**
   * 需要返回的周末星期数字，周日为 `0`，周六为 `6`。
   */
  weekends?: number[]
}

const toOffsetFromWeekStart = (weekday: number, weekStartDay: number): number => {
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
    throw new Error('weekends must contain integers from 0 (Sunday) to 6 (Saturday)')
  }

  return (weekday - weekStartDay + 7) % 7
}

/**
 * 返回包含 `date` 的一周内指定周末日期。
 *
 * `weekends` 使用真实 JavaScript 星期编号：周日为 `0`，周六为 `6`，而不是相对周起始日的偏移。
 * 返回日期遵循输入 `weekends` 顺序，并归一化到当天开始时刻。
 *
 * @param date 参考日期，默认当前日期。
 * @param options 周起始日和周末选择配置。
 * @returns 位于目标周内的选中周末日期。
 * @throws 当周末值不在 `0...6` 范围内时抛出错误。
 */
export function weekendsOfWeek(
  date?: dayjs.ConfigType,
  options: WeekendsOfWeekOptions = {},
): Dayjs[] {
  const { weekStartDay = 0, weekends = [0, 6] } = options
  const weekFirstDay = startOfWeek(date, { weekStartDay })

  return weekends.map((weekday) =>
    weekFirstDay.add(toOffsetFromWeekStart(weekday, weekStartDay), 'day').startOf('day'),
  )
}

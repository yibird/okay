import dayjs from 'dayjs'
import { getWeekRange } from './get-week-range'

/**
 * 检查给定日期是否在指定日期的同一周内
 * @param dateToCheck 要检查的日期
 * @param referenceDate 参考日期（可选，默认为当前日期）
 * @returns 如果在同一周则返回true，否则返回false
 */
export function isDateInWeek(
  dateToCheck: dayjs.ConfigType,
  referenceDate?: dayjs.ConfigType,
): boolean {
  const { startTime, endTime } = getWeekRange(referenceDate)
  const date = dayjs(dateToCheck)

  return (
    date.isSame(startTime, 'day') ||
    date.isSame(endTime, 'day') ||
    (date.isAfter(startTime) && date.isBefore(endTime))
  )
}

import type dayjs from 'dayjs'
import { parseDate } from './businessDayShared'

/**
 * 判断两个日期是否落在同一个日历日。
 *
 * @param dateLeft 第一个日期。
 * @param dateRight 第二个日期，默认当前日期。
 * @returns 两个日期都有效且处于同一天时返回 `true`。
 */
export function isSameDay(dateLeft: dayjs.ConfigType, dateRight?: dayjs.ConfigType): boolean {
  const left = parseDate(dateLeft)
  const right = parseDate(dateRight ?? new Date())
  return left !== null && right !== null && left.isSame(right, 'day')
}

import type dayjs from 'dayjs'
import {
  createWeekendSet,
  isHoliday,
  parseDate,
  type BusinessDayOptions,
} from './businessDayShared'

/**
 * 判断日期是否为工作日。
 *
 * @param date 需要判断的日期。
 * @param options 周末和节假日配置。
 * @returns 日期有效、不是周末且不是节假日时返回 `true`。
 */
export function isBusinessDay(date: dayjs.ConfigType, options: BusinessDayOptions = {}): boolean {
  const parsed = parseDate(date)
  if (parsed === null) return false

  const weekendSet = createWeekendSet(options.weekendDays)

  return !weekendSet.has(parsed.day()) && !isHoliday(parsed, options.holidays)
}

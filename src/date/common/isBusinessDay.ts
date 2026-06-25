import type dayjs from 'dayjs'
import {
  createWeekendSet,
  isHoliday,
  parseDate,
  type BusinessDayOptions,
} from './businessDayShared'

const DEFAULT_WEEKEND_SET = createWeekendSet()

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

  // Fast path: skip holiday check if no holidays provided
  const weekendSet = options.weekendDays
    ? createWeekendSet(options.weekendDays)
    : DEFAULT_WEEKEND_SET
  if (weekendSet.has(parsed.day())) return false
  if (!options.holidays || options.holidays.length === 0) return true

  return !isHoliday(parsed, options.holidays)
}

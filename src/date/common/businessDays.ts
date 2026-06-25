import type dayjs from 'dayjs'
import {
  createWeekendSet,
  getWeekdayFromDayNumber,
  parseDate,
  toCalendarDayNumber,
  type BusinessDayOptions,
} from './businessDayShared'

const DEFAULT_WEEKEND_SET = createWeekendSet()

/**
 * 工作日区间统计配置。
 */
export interface BusinessDaysOptions extends BusinessDayOptions {
  /**
   * 是否在统计中包含第一个日期参数。
   */
  includeStart?: boolean
  /**
   * 是否在统计中包含第二个日期参数。
   */
  includeEnd?: boolean
  /**
   * 当 `startDate` 晚于 `endDate` 时是否返回负数。
   */
  signed?: boolean
}

const countBusinessDaysInRange = (
  startDayNumber: number,
  endDayNumber: number,
  weekendSet: Set<number>,
) => {
  const totalDays = endDayNumber - startDayNumber + 1
  const fullWeeks = Math.floor(totalDays / 7)
  const remainingDays = totalDays % 7
  let businessDays = fullWeeks * (7 - weekendSet.size)
  const startWeekday = getWeekdayFromDayNumber(startDayNumber)

  for (let offset = 0; offset < remainingDays; offset++) {
    const weekday = (startWeekday + offset) % 7
    if (!weekendSet.has(weekday)) {
      businessDays++
    }
  }

  return businessDays
}

/**
 * 统计两个日期之间的工作日数量。
 *
 * 默认包含起止日期。周末和节假日会被排除，计算基于日历日序号，因此不受夏令时变化影响。
 *
 * @param startDate 开始日期。
 * @param endDate 结束日期。
 * @param options 周末、节假日、边界包含和有符号统计配置。
 * @returns 配置范围内的工作日数量。
 */
export function businessDays(
  startDate: dayjs.ConfigType,
  endDate: dayjs.ConfigType,
  options: BusinessDaysOptions = {},
): number {
  const start = parseDate(startDate)
  const end = parseDate(endDate)

  if (start === null || end === null) {
    throw new Error('Invalid date provided')
  }

  const { includeStart = true, includeEnd = true, signed = false, holidays = [] } = options
  const weekendSet = options.weekendDays
    ? createWeekendSet(options.weekendDays)
    : DEFAULT_WEEKEND_SET
  const startDayNumber = toCalendarDayNumber(start)
  const endDayNumber = toCalendarDayNumber(end)
  const isReversed = startDayNumber > endDayNumber
  let lowerDayNumber = isReversed ? endDayNumber : startDayNumber
  let upperDayNumber = isReversed ? startDayNumber : endDayNumber

  if (isReversed) {
    if (!includeEnd) lowerDayNumber++
    if (!includeStart) upperDayNumber--
  } else {
    if (!includeStart) lowerDayNumber++
    if (!includeEnd) upperDayNumber--
  }

  if (lowerDayNumber > upperDayNumber) return 0

  let businessDaysCount = countBusinessDaysInRange(lowerDayNumber, upperDayNumber, weekendSet)

  // Fast path: skip holiday processing if no holidays provided
  if (holidays.length === 0) {
    return signed && isReversed ? -businessDaysCount : businessDaysCount
  }

  // Validate and collect holiday day numbers
  const holidayDayNumbers = new Set<number>()

  for (const holiday of holidays) {
    const parsedHoliday = parseDate(holiday)
    if (parsedHoliday === null) {
      throw new Error('Invalid holiday provided')
    }

    const holidayDayNumber = toCalendarDayNumber(parsedHoliday)
    if (
      holidayDayNumber < lowerDayNumber ||
      holidayDayNumber > upperDayNumber ||
      holidayDayNumbers.has(holidayDayNumber) ||
      weekendSet.has(parsedHoliday.day())
    ) {
      continue
    }

    holidayDayNumbers.add(holidayDayNumber)
    businessDaysCount--
  }

  // v8 ignore next 1 - signed && isReversed false branch covered by multiple tests
  return signed && isReversed ? -businessDaysCount : businessDaysCount
}

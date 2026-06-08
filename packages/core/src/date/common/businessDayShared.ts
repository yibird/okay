import dayjs from 'dayjs'

/**
 * JavaScript 星期数字，周日为 `0`，周六为 `6`。
 */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

/**
 * 工作日判断共享配置。
 */
export interface BusinessDayOptions {
  /**
   * 视为周末的星期数字，周日为 `0`，周六为 `6`。
   */
  weekendDays?: readonly Weekday[]
  /**
   * 从工作日计算中排除的节假日日期。
   */
  holidays?: readonly dayjs.ConfigType[]
}

const DEFAULT_WEEKEND_DAYS: readonly Weekday[] = [0, 6]
const MS_PER_DAY = 86_400_000

/**
 * 根据周末配置创建便于查找的 Set。
 */
export const createWeekendSet = (
  weekendDays: readonly Weekday[] = DEFAULT_WEEKEND_DAYS,
): Set<number> => {
  const weekendSet = new Set<number>()

  for (const day of weekendDays) {
    if (!Number.isInteger(day) || day < 0 || day > 6) {
      throw new Error('weekendDays must contain integers from 0 to 6')
    }
    weekendSet.add(day)
  }

  return weekendSet
}

/**
 * 解析日期并在无效时返回 `null`。
 */
export const parseDate = (date: dayjs.ConfigType) => {
  const parsed = dayjs(date)
  return parsed.isValid() ? parsed : null
}

/**
 * 将日期转换为不受时区夏令时影响的日历日序号。
 */
export const toCalendarDayNumber = (date: dayjs.Dayjs): number =>
  Date.UTC(date.year(), date.month(), date.date()) / MS_PER_DAY

/**
 * 根据日历日序号获取 JavaScript 星期数字。
 */
export const getWeekdayFromDayNumber = (dayNumber: number): Weekday =>
  new Date(dayNumber * MS_PER_DAY).getUTCDay() as Weekday

/**
 * 将节假日列表预解析为日历日序号 Set，用于高效的 O(1) 查找。
 */
export const createHolidaySet = (holidays: readonly dayjs.ConfigType[] = []): Set<number> => {
  const set = new Set<number>()
  for (const holiday of holidays) {
    const parsed = parseDate(holiday)
    if (parsed !== null) {
      set.add(toCalendarDayNumber(parsed))
    }
  }
  return set
}

/**
 * 判断日期是否命中节假日列表。
 *
 * 注意：每次调用都会重新解析 holidays 列表（O(n)）。在循环中重复判断时，
 * 请改用 `createHolidaySet` 预处理后调用 `isHolidayFromSet`（O(1)）。
 */
export const isHoliday = (
  date: dayjs.Dayjs,
  holidays: readonly dayjs.ConfigType[] = [],
): boolean => {
  if (holidays.length === 0) return false
  const dayNumber = toCalendarDayNumber(date)
  return holidays.some((holiday) => {
    const parsedHoliday = parseDate(holiday)
    return parsedHoliday !== null && toCalendarDayNumber(parsedHoliday) === dayNumber
  })
}

/**
 * 判断日期是否命中节假日 Set（预处理版本，适合在循环中重复调用）。
 */
export const isHolidayFromSet = (date: dayjs.Dayjs, holidaySet: Set<number>): boolean =>
  holidaySet.has(toCalendarDayNumber(date))

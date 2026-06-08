import dayjs from 'dayjs'

/**
 * 判断日期是否落在指定年份。
 *
 * @param date Day.js 支持的日期类值。
 * @param year 完整年份，例如 `2024`。
 * @returns 当 `date` 有效且处于指定年份时返回 `true`。
 */
export function isInYear(date: dayjs.ConfigType, year: number): boolean {
  const parsed = dayjs(date)
  if (!parsed.isValid()) {
    return false
  }

  return parsed.year() === year
}

import dayjs from 'dayjs'

/**
 * 判断日期是否落在指定季度内。
 *
 * 未传入 `year` 时会使用 `date` 自身年份。
 *
 * @param date Day.js 支持的日期类值。
 * @param quarter `1...4` 范围内的季度编号。
 * @param year 可选的完整年份。
 * @returns 当 `date` 位于指定季度内时返回 `true`。
 * @throws 当 `quarter` 不在 `1...4` 范围内时抛出错误。
 */
export function isInQuarter(date: dayjs.ConfigType, quarter: number, year?: number): boolean {
  const d = dayjs(date)

  if (quarter < 1 || quarter > 4 || !Number.isInteger(quarter)) {
    throw new Error('Quarter must be an integer between 1 and 4')
  }

  if (!d.isValid()) {
    throw new Error('Invalid date provided')
  }

  const currentYear = year ?? d.year()
  const startMonth = (quarter - 1) * 3
  const startDate = dayjs(new Date(currentYear, startMonth, 1)).startOf('month')
  const endDate = startDate.add(2, 'month').endOf('month')

  const ts = d.valueOf()
  return ts >= startDate.valueOf() && ts <= endDate.valueOf()
}

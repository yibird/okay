import dayjs from 'dayjs'

/**
 * 判断日期是否落在指定月份。
 *
 * 该判断会忽略年份，因此任意年份的一月都会匹配 `month = 1`。
 *
 * @param date Day.js 支持的日期类值。
 * @param month `1...12` 范围内的月份数字。
 * @returns 当 `date` 位于指定月份时返回 `true`。
 * @throws 当 `month` 不在 `1...12` 范围内或 `date` 无效时抛出错误。
 */
export function isInMonth(date: dayjs.ConfigType, month: number): boolean {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error('Month must be between 1 and 12')
  }

  const d = dayjs(date)
  if (!d.isValid()) {
    throw new Error('Invalid date provided')
  }

  return d.month() + 1 === month
}

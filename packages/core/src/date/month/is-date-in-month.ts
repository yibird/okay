import dayjs from 'dayjs'

/**
 * 检查日期是否在指定的月份内
 * @param date 日期
 * @param month 月份
 * @returns boolean
 */
export function isDateInMonth(date: dayjs.ConfigType, month: number): boolean {
  if (month < 1 || month > 12) {
    throw new Error('Month must be between 1 and 12')
  }

  const d = dayjs(date)
  if (!d.isValid()) {
    throw new Error('Invalid date provided')
  }

  return d.month() + 1 === month
}

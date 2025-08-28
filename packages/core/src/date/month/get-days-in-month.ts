import dayjs from 'dayjs'

/**
 * 获取指定月份的天数
 * @param year 年
 * @param month 月
 * @returns 天数
 */
export function getDaysInMonth(year: number, month: number) {
  return dayjs(`${year}-${month}-01`).daysInMonth()
}

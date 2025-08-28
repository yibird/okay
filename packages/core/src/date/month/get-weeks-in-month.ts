import { getDaysInMonth } from './get-days-in-month'
import { getFirstDayOfMonth } from './get-first-day-of-month'
import { getLastDayOfMonth } from './get-last-day-of-month'

/**
 * 获取月份的周数
 * @param year 年
 * @param month 月
 * @param startOfWeek 周的开始时间,默认是周日
 * @returns 返回指定月份的周数
 */
export function getWeeksInMonth(year: number, month: number, startOfWeek = 0) {
  const firstDay = getFirstDayOfMonth(year, month)
  const lastDay = getLastDayOfMonth(year, month)

  const firstDayOfWeek = firstDay.day()
  const lastDayOfWeek = lastDay.day()

  const daysInMonth = getDaysInMonth(year, month)

  let adjustedFirstDay = firstDayOfWeek - startOfWeek
  if (adjustedFirstDay < 0) adjustedFirstDay += 7

  let adjustedLastDay = lastDayOfWeek - startOfWeek
  if (adjustedLastDay < 0) adjustedLastDay += 7

  return Math.ceil((adjustedFirstDay + daysInMonth) / 7)
}

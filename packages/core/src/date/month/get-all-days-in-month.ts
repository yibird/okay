import { getDaysInMonth } from './get-days-in-month'
import { getFirstDayOfMonth } from './get-first-day-of-month'
import type dayjs from 'dayjs'

/**
 * 获取指定月份的所有日期
 * @param year 年份
 * @param month 月份（1-12）
 * @returns 日期数组
 */
export function getAllDaysInMonth(year: number, month: number) {
  const days: dayjs.Dayjs[] = []
  const date = getFirstDayOfMonth(year, month)
  const daysInMonth = getDaysInMonth(year, month)

  for (let i = 0; i < daysInMonth; i++) {
    days.push(date.add(i, 'day'))
  }

  return days
}

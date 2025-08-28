import { getAllDaysInMonth } from './get-all-days-in-month'

/**
 * 获取某月的所有工作日(周一至周五)
 * @param year 年
 * @param month 月
 * @returns 工作日数组,数组元素为dayjs.Dayjs对象
 */
export function getWeekdaysInMonth(year: number, month: number) {
  return getAllDaysInMonth(year, month).filter((item) => {
    const dayOfWeek = item.day()
    return dayOfWeek > 0 && dayOfWeek < 6
  })
}

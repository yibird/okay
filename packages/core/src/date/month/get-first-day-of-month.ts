import dayjs from 'dayjs'

/**
 * 获取指定月份的第一天
 * @param year 年
 * @param month 月
 * @returns 第一天的日期对象
 */
export function getFirstDayOfMonth(year: number, month: number) {
  return dayjs(`${year}-${month}-01`).startOf('month')
}

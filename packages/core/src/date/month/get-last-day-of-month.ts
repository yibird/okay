import dayjs from 'dayjs'

/**
 * 获取指定月份的最后一天
 * @param year 年
 * @param month 月
 * @returns 最后一天的日期对象
 */
export function getLastDayOfMonth(year: number, month: number) {
  return dayjs(`${year}-${month}-01`).endOf('month')
}

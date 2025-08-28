import dayjs from 'dayjs'

/**
 * 获取两个日期之间的月数差值
 * @param date1 日期1
 * @param date2 日期2
 * @returns 月数差值
 */
export function getMonthDiff(date1: dayjs.Dayjs, date2: dayjs.Dayjs) {
  return dayjs(date1).diff(dayjs(date2), 'month')
}

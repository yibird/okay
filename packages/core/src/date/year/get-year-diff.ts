import dayjs from 'dayjs'

/**
 * 获取两个日期之间的年份差
 * @param date1 日期1
 * @param date2 日期2
 * @returns 返回两个日期之间的年份差
 */
export function getYearDiff(date1: dayjs.ConfigType, date2: dayjs.ConfigType) {
  return dayjs(date1).diff(dayjs(date2), 'year')
}

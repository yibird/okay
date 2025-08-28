import dayjs from 'dayjs'

/**
 * 获取指定年份的第一天
 * @param year 年份
 * @returns 返回指定年份的第一天
 */
export function getFirstDayOfYear(year: number) {
  return dayjs().year(year).startOf('year')
}

import dayjs from 'dayjs'

/**
 * 获取指定年份的最后一天
 * @param year 年份
 * @returns 返回指定年份的最后一天
 */
export function getLastDayOfYear(year: number) {
  return dayjs().year(year).endOf('year')
}

import dayjs from 'dayjs'

/**
 * 判断日期是否在指定年份
 * @param date 日期
 * @param year 年份
 * @returns 返回true表示日期在指定年份,返回false表示日期不在指定年份
 */
export function isDateInYear(date: dayjs.ConfigType, year: number) {
  return dayjs(date).year() === year
}

import dayjs from 'dayjs'

/**
 * 判断指定日期是否为周末
 * @param date 日期
 * @returns 如果指定日期为周末,返回true,否则返回false
 */
export function isWeekend(date?: dayjs.ConfigType) {
  const day = dayjs(date).day()
  return day === 0 || day === 6
}

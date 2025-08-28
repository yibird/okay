import dayjs from 'dayjs'

/**
 * 获取指定日期是本周第几天
 * @param date 日期
 * @returns 返回指定日期是本周第几天,(周一=1，周日=7)
 */
export function getDayIndexInWeek(date?: dayjs.ConfigType) {
  const d = dayjs(date)
  const day = d.day()
  return day === 0 ? 7 : day
}

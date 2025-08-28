import dayjs from 'dayjs'

/**
 * 获取指定日期所在周的所有日期(周一到周日)
 * @param date 时间
 * @returns 返回一个数组,包含周一到周日的日期
 */
export function getWeekDays(date?: dayjs.ConfigType) {
  const d = dayjs(date)
  const monday = d.startOf('week').add(1, 'day') // 周一
  return Array.from({ length: 7 }, (_, i) => monday.add(i, 'day'))
}

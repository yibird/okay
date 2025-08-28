import dayjs from 'dayjs'

/**
 * 获取一周的第一天
 * @param date 可选的日期，如果不提供则使用当前日期
 * @param options 可选的配置项
 * @param options.weekStartDay 周的开始日，0 表示星期日，1 表示星期一，默认为 0
 * @returns 一周的第一天的 Dayjs 对象，时间部分为 00:00:00
 */
export function getFirstDayOfWeek(
  date?: dayjs.ConfigType,
  options: { weekStartDay?: number } = {},
) {
  const { weekStartDay = 0 } = options

  // Validate weekStartDay
  if (weekStartDay < 0 || weekStartDay > 6) {
    throw new Error('weekStartDay must be between 0 (Sunday) and 6 (Saturday)')
  }

  const currentDate = dayjs(date)

  // Validate date
  if (!currentDate.isValid()) {
    throw new Error('Invalid date provided')
  }

  const day = currentDate.day()

  // 计算与周开始日的差值
  let diff = day - weekStartDay
  if (diff < 0) {
    diff += 7
  }

  return currentDate.subtract(diff, 'day').startOf('day')
}

import dayjs from 'dayjs'
import { getFirstDayOfWeek } from './get-first-day-of-week'
import { getLastDayOfWeek } from './get-last-day-of-week'

/**
 * 获取下一周的日期范围
 * @param date 参考日期，默认为当前日期
 * @param options 配置项
 * @param options.weekStartDay 周起始日，0为周日，1为周一，默认0
 * @returns 包含下一周第一天和最后一天的对象
 */
export function getNextWeek(
  date?: dayjs.ConfigType,
  options: { weekStartDay?: 0 | 1 } = {},
) {
  // 默认使用当前日期
  const currentDate = date ? dayjs(date) : dayjs()
  // 获取当前周第一天
  const currentWeekFirstDay = getFirstDayOfWeek(currentDate, options)
  // 下一周第一天 = 当前周第一天 + 7天
  const nextWeekFirstDay = currentWeekFirstDay.add(7, 'day')
  // 下一周最后一天 = 下一周第一天 + 6天，并设置时间为23:59:59
  const nextWeekLastDay = getLastDayOfWeek(nextWeekFirstDay, options)
  return [nextWeekFirstDay, nextWeekLastDay]
}

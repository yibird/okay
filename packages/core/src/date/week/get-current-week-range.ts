import dayjs from 'dayjs'
import { getFirstDayOfWeek } from './get-first-day-of-week'
import { getLastDayOfWeek } from './get-last-day-of-week'

/**
 * 获取当前周的日期范围
 * @param date 参考日期，默认为当前日期
 * @param options 配置项
 * @param options.weekStartDay 周起始日，0为周日，1为周一，默认0
 * @returns 返回一个数组,包含当前周第一天和最后一天的 dayjs 实例
 */
export function getCurrentWeekRange(
  date?: dayjs.ConfigType,
  options: { weekStartDay?: 0 | 1 } = {},
) {
  // 默认使用当前日期
  const currentDate = date ? dayjs(date) : dayjs()
  // 获取当前周第一天
  const currentWeekFirstDay = getFirstDayOfWeek(currentDate, options)
  // 获取当前周最后一天
  const currentWeekLastDay = getLastDayOfWeek(currentDate, options)
  return [currentWeekFirstDay, currentWeekLastDay]
}

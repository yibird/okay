import dayjs from 'dayjs'
import { getFirstDayOfWeek } from './get-first-day-of-week'

/**
 * 获取一周中的工作日
 * @param date 参考日期，默认为当前日期
 * @param options 配置项
 * @param options.weekStartDay 周起始日，0为周日，1为周一，默认0
 * @param options.weekdays 自定义工作日，默认为[1,2,3,4,5]（周一到周五）
 * @returns 包含工作日的Dayjs对象数组，时间部分为00:00:00
 */
export function getWeekdaysInWeek(
  date?: dayjs.ConfigType,
  options: { weekStartDay?: 0 | 1; weekdays?: number[] } = {},
) {
  const { weekStartDay = 0, weekdays = [1, 2, 3, 4, 5] } = options
  const currentDate = date ? dayjs(date) : dayjs()
  const weekFirstDay = getFirstDayOfWeek(currentDate, { weekStartDay })

  return weekdays.map((dayOffset) => {
    // 计算相对于周起始日的偏移量
    return weekFirstDay.add(dayOffset, 'day').startOf('day')
  })
}

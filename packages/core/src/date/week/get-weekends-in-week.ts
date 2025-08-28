import dayjs, { type Dayjs } from 'dayjs'
import { getFirstDayOfWeek } from './get-first-day-of-week'

/**
 * 获取一周中的周末
 * @param date 参考日期，默认为当前日期
 * @param options 配置项
 * @param options.weekStartDay 周起始日，0为周日，1为周一，默认0
 * @param options.weekends 自定义周末，默认为[0,6]（周日和周六）
 * @returns 包含周末的Dayjs对象数组，时间部分为00:00:00
 */
export function getWeekendsInWeek(
  date?: Dayjs | string | number,
  options: { weekStartDay?: 0 | 1; weekends?: number[] } = {},
): Dayjs[] {
  const { weekStartDay = 0, weekends = [0, 6] } = options
  const currentDate = date ? dayjs(date) : dayjs()
  const weekFirstDay = getFirstDayOfWeek(currentDate, { weekStartDay })

  return weekends.map((dayOffset) => {
    // 计算相对于周起始日的偏移量
    return weekFirstDay.add(dayOffset, 'day').startOf('day')
  })
}

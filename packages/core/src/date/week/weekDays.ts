import dayjs, { type Dayjs } from 'dayjs'
import { startOfWeek } from './startOfWeek'

/**
 * 返回包含 `date` 的 ISO 风格周内每一天。
 *
 * 结果始终按周一到周日排序，每一项都归一化到当天开始时刻，避免依赖 Day.js locale 的周起始设置。
 *
 * @param date 参考日期，默认当前日期。
 * @returns 周一到周日的七个 `Dayjs` 值。
 */
export function weekDays(date?: dayjs.ConfigType): Dayjs[] {
  const monday = startOfWeek(date, { weekStartDay: 1 })
  const days: Dayjs[] = []

  for (let index = 0; index < 7; index++) {
    days.push(monday.add(index, 'day'))
  }

  return days
}

import dayjs from 'dayjs'
import { getWeek } from './get-week'

/**
 * 获取日期所在年份的周数
 * @param date 参考日期，默认为当前日期
 * @returns 周数（1-53）
 */
export function getWeekOfYear(date?: dayjs.ConfigType) {
  const currentDate = date ? dayjs(date) : dayjs()
  return getWeek(currentDate)
}

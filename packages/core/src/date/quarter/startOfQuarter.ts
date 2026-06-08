import dayjs, { type Dayjs } from 'dayjs'
import { parseQuarterDate } from './quarterShared'

/**
 * 返回包含 `date` 的季度开始时刻。
 *
 * @param date 参考日期，默认当前日期。
 * @returns 该季度第一天 `00:00:00.000` 的 Day.js 值。
 */
export function startOfQuarter(date?: dayjs.ConfigType): Dayjs {
  const d = parseQuarterDate(date)
  const month = d.month()
  const quarterStartMonth = Math.floor(month / 3) * 3

  return d.month(quarterStartMonth).date(1).startOf('day')
}

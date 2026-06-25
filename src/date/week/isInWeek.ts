import dayjs from 'dayjs'
import { weekRange } from './weekRange'

/**
 * 判断日期是否与参考日期处于同一个周一到周日周内。
 *
 * @param dateToCheck 需要判断的日期。
 * @param referenceDate 参考日期，默认当前日期。
 * @returns 当 `dateToCheck` 位于参考周内时返回 `true`。
 */
export function isInWeek(dateToCheck: dayjs.ConfigType, referenceDate?: dayjs.ConfigType): boolean {
  const { startTime, endTime } = weekRange(referenceDate)
  const date = dayjs(dateToCheck)
  if (!date.isValid()) return false
  // startTime is already startOf('day'), endTime is already endOf('day') from weekRange.
  const ts = date.valueOf()
  return ts >= startTime.valueOf() && ts <= endTime.valueOf()
}

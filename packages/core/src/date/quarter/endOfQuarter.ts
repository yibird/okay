import dayjs, { type Dayjs } from 'dayjs'
import { parseQuarterDate } from './quarterShared'

/**
 * 返回包含 `date` 的季度结束时刻。
 *
 * 省略、`null` 和空字符串输入会被视为当前日期；其他无效日期会抛出错误。
 *
 * @param date 参考日期，默认当前日期。
 * @returns 该季度最后一天 `23:59:59.999` 的 Day.js 值。
 */
export function endOfQuarter(date?: dayjs.ConfigType): Dayjs {
  const d = parseQuarterDate(date)
  const quarterIndex = Math.floor(d.month() / 3)
  const quarterEndMonth = quarterIndex * 3 + 2

  return d.month(quarterEndMonth).endOf('month').endOf('day')
}

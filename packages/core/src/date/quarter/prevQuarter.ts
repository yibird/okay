import dayjs from 'dayjs'
import type { QuarterRange } from './types'
import { parseQuarterDate } from './quarterShared'

/**
 * 返回包含 `date` 的上一季度范围。
 *
 * 省略、`null` 和空字符串输入会被视为当前日期；其他无效日期会抛出错误。
 *
 * @param date 参考日期，默认当前日期。
 * @returns 上一季度的开始和结束时间。
 */
export function prevQuarter(date?: dayjs.ConfigType): QuarterRange {
  const d = parseQuarterDate(date)
  const currentQuarter = Math.floor(d.month() / 3)
  const previousQuarter = (currentQuarter - 1 + 4) % 4
  const year = currentQuarter === 0 ? d.year() - 1 : d.year()
  const startTime = dayjs(new Date(year, previousQuarter * 3, 1)).startOf('month')

  return {
    startTime,
    endTime: startTime.add(2, 'month').endOf('month'),
  }
}

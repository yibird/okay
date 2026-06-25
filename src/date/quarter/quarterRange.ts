import dayjs, { type Dayjs } from 'dayjs'
import { quarter } from './quarter'
import { parseQuarterDate } from './quarterShared'

/**
 * 季度范围信息。
 */
export interface QuarterRangeInfo {
  quarter: number
  startTime: Dayjs
  endTime: Dayjs
  year: number
  toString: () => string
}

/**
 * 返回日期所属季度范围。
 *
 * 返回对象包含 `toString` 辅助方法，会格式化为 `Q{quarter}-{year}`。
 *
 * @param date 参考日期，默认当前日期。
 * @returns 季度编号、日期范围、年份和字符串格式化器。
 */
export function quarterRange(date?: dayjs.ConfigType): QuarterRangeInfo {
  const resultQuarter = quarter(date)
  const startMonth = (resultQuarter - 1) * 3
  const d = parseQuarterDate(date)

  return {
    quarter: resultQuarter,
    startTime: d.month(startMonth).startOf('month'),
    endTime: d.month(startMonth + 2).endOf('month'),
    year: d.year(),
    toString: () => `Q${resultQuarter}-${d.year()}`,
  }
}

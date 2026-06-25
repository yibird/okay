import dayjs, { type Dayjs } from 'dayjs'
import { getQuarterNumber, parseQuarterDate } from './quarterShared'

/**
 * 日期所属季度的详细信息。
 */
export interface QuarterOfYear {
  quarter: number
  startTime: Dayjs
  endTime: Dayjs
  text: string
  year: number
}

/**
 * 返回日期所属季度的详细信息。
 *
 * 省略、`null` 和空字符串输入会被视为当前日期；其他无效日期会抛出错误。
 *
 * @param date 参考日期，默认当前日期。
 * @returns 季度编号、起止范围、展示文本和年份。
 */
export function quarterOfYear(date?: dayjs.ConfigType): QuarterOfYear {
  const d = parseQuarterDate(date)
  const quarter = getQuarterNumber(d)
  const year = d.year()
  const startMonth = (quarter - 1) * 3
  const startTime = dayjs(d).year(year).month(startMonth).startOf('month')
  const endTime = dayjs(d)
    .year(year)
    .month(startMonth + 2)
    .endOf('month')

  return {
    quarter,
    startTime,
    endTime,
    text: `Q${quarter}`,
    year,
  }
}

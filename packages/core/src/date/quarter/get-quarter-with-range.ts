import dayjs from 'dayjs'
import { getQuarter } from './get-quarter'

export function getQuarterWithRange(date?: dayjs.ConfigType) {
  const quarter = getQuarter(date)
  const startMonth = (quarter - 1) * 3
  const d = dayjs(date || undefined)

  return {
    quarter,
    startTime: d.month(startMonth).startOf('month'),
    endTime: d.month(startMonth + 2).endOf('month'),
    year: d.year(),
    toString: () => `Q${quarter}-${d.year()}`, // 示例：Q2-2023
  }
}

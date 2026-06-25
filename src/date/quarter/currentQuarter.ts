import dayjs, { type Dayjs } from 'dayjs'

/**
 * 返回当前季度范围。
 *
 * @returns 包含季度开始和季度结束的元组。
 */
export function currentQuarter(): [Dayjs, Dayjs] {
  const current = dayjs()
  const quarterIndex = Math.floor(current.month() / 3)
  const startMonth = quarterIndex * 3
  const endMonth = startMonth + 2

  return [current.month(startMonth).startOf('month'), current.month(endMonth).endOf('month')]
}

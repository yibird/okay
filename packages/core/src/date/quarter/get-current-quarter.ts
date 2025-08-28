import dayjs from 'dayjs'

/**
 * 获取当前季度
 * @returns 返回一个对象,包含季度的开始时间和结束时间
 */
export function getCurrentQuarter() {
  const current = dayjs()
  const quarter = Math.floor(current.month() / 3)
  const startMonth = quarter * 3
  const endMonth = startMonth + 2

  return [
    current.month(startMonth).startOf('month'),
    current.month(endMonth).endOf('month'),
  ]
}

import dayjs from 'dayjs'

/**
 * 获取上一个季度的起始和结束时间
 * @param date 参考日期（可选，默认为当前日期）
 * @returns 返回包含季度开始时间和结束时间的对象
 */
export function getPrevQuarter(date?: dayjs.ConfigType): {
  startTime: dayjs.Dayjs
  endTime: dayjs.Dayjs
} {
  const d = dayjs(date).isValid() ? dayjs(date) : dayjs()

  // 计算上一个季度
  const currentQuarter = Math.floor(d.month() / 3)
  const prevQuarter = (currentQuarter - 1 + 4) % 4 // 确保结果在0-3范围内
  const year = currentQuarter === 0 ? d.year() - 1 : d.year()

  // 计算季度起始月份
  const startMonth = prevQuarter * 3
  const startTime = dayjs(new Date(year, startMonth, 1)).startOf('month')
  const endTime = startTime.add(3, 'month').subtract(1, 'day').endOf('day')

  return {
    startTime,
    endTime: endTime.endOf('day'), // 包含完整的一天
  }
}

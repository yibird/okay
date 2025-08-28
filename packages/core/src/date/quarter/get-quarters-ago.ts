import dayjs from 'dayjs'

/**
 * 获取n个季度之前的季度
 * @param n 季度数
 * @param date dayjs.ConfigType
 * @returns 返回一个对象,包含季度的开始时间和结束时间
 */
export function getQuartersAgo(n: number, date?: dayjs.ConfigType) {
  if (n < 0) {
    throw new Error('Number of quarters must be a positive integer')
  }

  const d = dayjs(date || undefined)
  const currentQuarter = Math.floor(d.month() / 3)
  const totalQuarters = currentQuarter - n

  const targetYear = d.year() + Math.floor(totalQuarters / 4)
  const targetQuarter = ((totalQuarters % 4) + 4) % 4 // Ensure positive modulo
  const startMonth = targetQuarter * 3

  const startTime = dayjs(d).year(targetYear).month(startMonth).startOf('month')
  const endTime = startTime.add(2, 'month').endOf('month')

  return { startTime, endTime }
}

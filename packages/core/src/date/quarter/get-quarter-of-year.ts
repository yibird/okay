import dayjs from 'dayjs'

/**
 * 获取指定日期所在的季度
 * @param date 日期对象或可转换为日期的值 (可选，默认为当前日期)
 * @returns 返回包含季度信息(1-4)、季度开始时间、季度结束时间、季度文本和年份的对象
 */
export function getQuarterOfYear(date?: dayjs.ConfigType) {
  const d = dayjs(date || undefined)
  const month = d.month() // 0-11
  const quarter = Math.floor(month / 3) + 1 // 1-4
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

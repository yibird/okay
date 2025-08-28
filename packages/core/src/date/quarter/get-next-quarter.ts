import dayjs from 'dayjs'

/**
 * 获取下一个季度的起始和结束时间
 * @param date 参考日期（可选，默认为当前日期）
 * @returns 返回包含季度开始时间和结束时间的对象
 */
export function getNextQuarter(date?: dayjs.ConfigType): {
  startTime: dayjs.Dayjs
  endTime: dayjs.Dayjs
} {
  const d = dayjs(date).isValid() ? dayjs(date) : dayjs()
  const currentQuarter = Math.floor(d.month() / 3)
  const nextQuarter = (currentQuarter + 1) % 4
  const year = nextQuarter === 0 ? d.year() + 1 : d.year()
  const startMonth = nextQuarter * 3
  const startTime = dayjs(new Date(year, startMonth, 1)).startOf('month')
  const endTime = dayjs(new Date(year, startMonth + 3, 0)).endOf('month')
  return {
    startTime,
    endTime: endTime.endOf('day'),
  }
}

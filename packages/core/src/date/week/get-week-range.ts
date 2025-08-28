import dayjs from 'dayjs'

/**
 * 获取当前周的时间范围
 * @param date 时间
 * @returns 返回一个对象,包含周的开始时间和结束时间
 */
export function getWeekRange(date?: dayjs.ConfigType) {
  const d = dayjs(date)
  const startTime = d.startOf('week').add(1, 'day')
  const endTime = d.endOf('week').add(1, 'day')
  return { startTime, endTime }
}

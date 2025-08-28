import dayjs from 'dayjs'

/**
 * 获取指定日期所在的季度
 * @param date 日期对象或可转换为日期的值 (可选，默认为当前日期)
 * @returns 返回1-4的数字表示当前季度
 */
export function getQuarter(date?: dayjs.ConfigType) {
  const d = dayjs(date || undefined)
  const month = d.month()
  return Math.floor(month / 3) + 1
}

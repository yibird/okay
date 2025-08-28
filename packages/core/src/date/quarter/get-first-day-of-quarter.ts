import dayjs from 'dayjs'

/**
 * 获取指定日期所在季度的第一天
 * @param date 日期 (可选，默认为当前日期)
 * @returns 返回季度第一天的dayjs对象
 */
export function getFirstDayOfQuarter(date?: dayjs.ConfigType): dayjs.Dayjs {
  const d = dayjs(date)
  const month = d.month()
  const quarterStartMonth = Math.floor(month / 3) * 3
  return d.month(quarterStartMonth).date(1).startOf('day')
}

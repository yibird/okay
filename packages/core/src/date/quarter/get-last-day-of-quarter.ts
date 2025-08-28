import dayjs from 'dayjs'

/**
 * 获取指定日期所在季度的最后一天
 * @param date 日期对象或可转换为日期的值 (可选，默认为当前日期)
 * @returns 返回季度最后一天的dayjs对象，时间部分设置为23:59:59.999
 */
export function getLastDayOfQuarter(date?: dayjs.ConfigType) {
  const d = dayjs(date).isValid() ? dayjs(date) : dayjs()
  const quarter = Math.floor(d.month() / 3)
  const quarterEndMonth = quarter * 3 + 2 // 季度最后月份 (2,5,8,11)
  return d.month(quarterEndMonth).endOf('month').endOf('day')
}

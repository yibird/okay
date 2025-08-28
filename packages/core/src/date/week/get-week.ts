import dayjs from 'dayjs'

/**
 * 返回 ISO 周序号（1..53）
 * - 周一为一周第一天；包含 1 月 4 日的那周为第 1 周
 * - 接受 dayjs.ConfigType（string | number | Date | dayjs 等）
 * - 输入无效时抛出 Error
 */
export function getWeek(date?: dayjs.ConfigType) {
  const d = date === undefined ? dayjs() : dayjs(date)
  if (!d.isValid()) {
    throw new Error('Invalid date')
  }
  // 统一到日期开始，避免时分秒/夏令时影响
  const dt = d.startOf('day')

  // ISO weekday: Mon=1..Sun=7
  const isoWeekday = dt.day() === 0 ? 7 : dt.day()

  // 把日期移到最近的周四
  const targetThu = dt.add(4 - isoWeekday, 'day').startOf('day')

  // 该日期所属的 ISO 年
  const isoYear = targetThu.year()

  // 找到该 ISO 年的“第一周的周四”
  // 取该年 1 月 4 日，然后同样移到最近的周四
  const jan4 = dayjs(new Date(isoYear, 0, 4)).startOf('day')
  const jan4IsoWeekday = jan4.day() === 0 ? 7 : jan4.day()
  const firstThu = jan4.add(4 - jan4IsoWeekday, 'day').startOf('day')

  // 以周为单位计算差值：1 + floor((targetThu - firstThu)/7天)
  const diffDays = targetThu.diff(firstThu, 'day')
  const week = 1 + Math.floor(diffDays / 7)

  return week
}

import dayjs from 'dayjs'

/**
 * 返回日期对应的 ISO 周序号。
 *
 * ISO 周从周一开始，包含 1 月 4 日的那一周为第 1 周。
 *
 * @param date 参考日期，默认当前日期。
 * @returns `1...53` 范围内的 ISO 周序号。
 * @throws 当 `date` 无效时抛出错误。
 */
export function isoWeek(date?: dayjs.ConfigType): number {
  const d = date === undefined ? dayjs() : dayjs(date)
  if (!d.isValid()) {
    throw new Error('Invalid date')
  }

  const dt = d.startOf('day')
  const isoWeekday = dt.day() === 0 ? 7 : dt.day()
  const targetThu = dt.add(4 - isoWeekday, 'day').startOf('day')
  const isoYear = targetThu.year()
  const jan4 = dayjs(new Date(isoYear, 0, 4)).startOf('day')
  const jan4IsoWeekday = jan4.day() === 0 ? 7 : jan4.day()
  const firstThu = jan4.add(4 - jan4IsoWeekday, 'day').startOf('day')

  return 1 + Math.floor(targetThu.diff(firstThu, 'day') / 7)
}

import dayjs from 'dayjs'

/**
 * 判断日期是否为周六或周日。
 *
 * 无效输入会返回 `false`。
 *
 * @param date Day.js 支持的日期类值，默认当前时间。
 * @returns 周六或周日返回 `true`。
 */
export function isWeekend(date?: dayjs.ConfigType): boolean {
  const parsed = date === undefined ? dayjs() : dayjs(date)
  if (!parsed.isValid()) return false

  const day = parsed.day()
  return day === 0 || day === 6
}

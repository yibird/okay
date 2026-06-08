import dayjs from 'dayjs'

/**
 * 返回 ISO 风格星期序号。
 *
 * 周一为 `1`，周六为 `6`，周日为 `7`。为保持既有行为，无效日期会返回 `NaN`。
 *
 * @param date Day.js 支持的日期类值，默认当前时间。
 * @returns `1...7` 范围内的星期序号；无效输入返回 `NaN`。
 */
export function weekdayIndex(date?: dayjs.ConfigType): number {
  const d = dayjs(date)
  const day = d.day()
  return day === 0 ? 7 : day
}

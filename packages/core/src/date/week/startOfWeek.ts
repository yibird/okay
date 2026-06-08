import dayjs, { type Dayjs } from 'dayjs'

/**
 * 返回包含 `date` 的周开始时刻。
 *
 * `weekStartDay` 遵循 JavaScript 星期编号：周日为 `0`，周六为 `6`。
 *
 * @param date 参考日期，默认当前日期。
 * @param options 周起始日配置。
 * @returns 该周第一天 `00:00:00.000` 的 Day.js 值。
 * @throws 当 `weekStartDay` 不在 `0...6` 范围内或 `date` 无效时抛出错误。
 */
export function startOfWeek(
  date?: dayjs.ConfigType,
  options: { weekStartDay?: number } = {},
): Dayjs {
  const { weekStartDay = 0 } = options

  if (!Number.isInteger(weekStartDay) || weekStartDay < 0 || weekStartDay > 6) {
    throw new Error('weekStartDay must be between 0 (Sunday) and 6 (Saturday)')
  }

  const currentDate = date === undefined ? dayjs() : dayjs(date)
  if (!currentDate.isValid()) {
    throw new Error('Invalid date provided')
  }

  let diff = currentDate.day() - weekStartDay
  if (diff < 0) diff += 7

  return currentDate.subtract(diff, 'day').startOf('day')
}

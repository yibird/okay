import dayjs from 'dayjs'

/**
 * 计算两个日期之间的整数月份差。
 *
 * 结果遵循 Day.js `diff(..., 'month')` 语义：`date1` 晚于 `date2` 时返回正数，不足整月会被截断。
 *
 * @param date1 被减日期。
 * @param date2 减数日期。
 * @returns 整数月份差。
 */
export function diffMonths(date1: dayjs.ConfigType, date2: dayjs.ConfigType): number {
  return dayjs(date1).diff(dayjs(date2), 'month')
}

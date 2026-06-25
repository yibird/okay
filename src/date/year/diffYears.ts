import dayjs from 'dayjs'

/**
 * 计算两个日期之间的整数年份差。
 *
 * 结果遵循 Day.js `diff(..., 'year')` 语义：`date1` 晚于 `date2` 时返回正数，不足整年会被截断。
 *
 * @param date1 被减日期。
 * @param date2 减数日期。
 * @returns 整数年份差。
 */
export function diffYears(date1: dayjs.ConfigType, date2: dayjs.ConfigType): number {
  return dayjs(date1).diff(dayjs(date2), 'year')
}

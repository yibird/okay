import dayjs from 'dayjs'

/**
 * 判断日期所属年份是否为闰年。
 *
 * 为兼容既有 API，数字输入会被当作 Day.js 时间戳处理。
 * 如果要直接检查日历年份，请传入类似 `"2024-01-01"` 的日期字符串。
 *
 * @param date Day.js 支持的日期类值，默认当前日期。
 * @returns 解析出的年份为闰年时返回 `true`。
 * @throws 当提供的 `date` 无法解析时抛出错误。
 */
export function isLeapYear(date?: dayjs.ConfigType): boolean {
  let year: number

  if (date === undefined) {
    year = dayjs().year()
  } else if (typeof date === 'number' && Number.isInteger(date) && Math.abs(date) <= 9999) {
    year = date
  } else {
    const d = dayjs(date)
    if (!d.isValid() || (typeof date === 'string' && Number.isNaN(Date.parse(date)))) {
      throw new Error('Invalid date input')
    }
    year = d.year()
  }

  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)
}

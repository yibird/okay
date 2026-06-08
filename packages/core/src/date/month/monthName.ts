import dayjs from 'dayjs'

// Use a fixed reference date (1970-01-01) to avoid creating a live dayjs() on every call.
const REF_DATE = dayjs('1970-01-01')

/**
 * 返回本地化月份名称。
 *
 * `month` 使用人类可读编号：`1` 表示一月，`12` 表示十二月。
 * 本地化输出取决于运行时已加载的 Day.js locale 数据。
 *
 * @param month `1...12` 范围内的月份数字。
 * @param locale Day.js locale 名称，默认 `en`。
 * @returns 本地化完整月份名称。
 */
export function monthName(month: number, locale = 'en'): string {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError('month must be between 1 and 12')
  }
  return REF_DATE.month(month - 1)
    .locale(locale)
    .format('MMMM')
}

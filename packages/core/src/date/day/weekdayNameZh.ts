import dayjs, { type Dayjs } from 'dayjs'

const DAY_NAMES = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

/**
 * 根据星期数字或 Day.js 值返回中文星期名称。
 *
 * 数字输入遵循 JavaScript 星期编号：周日为 `0`，周六为 `6`；超出范围的值会按 7 取模。
 *
 * @param day 星期数字或 Day.js 实例，默认今天。
 * @returns 中文星期名称。
 */
export function weekdayNameZh(day?: number | Dayjs): string {
  if (day === undefined) {
    return DAY_NAMES[dayjs().day()]
  }

  if (typeof day === 'number') {
    return DAY_NAMES[((day % 7) + 7) % 7]
  }

  if (dayjs.isDayjs(day)) {
    return DAY_NAMES[day.day()]
  }

  return DAY_NAMES[dayjs().day()]
}

import dayjs from 'dayjs'

/**
 * 返回当前本地月份数字。
 *
 * @returns `1...12` 范围内的月份数字。
 */
export function currentMonth(): number {
  return dayjs().month() + 1
}

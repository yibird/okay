import dayjs from 'dayjs'

/**
 * 返回当前本地年份。
 *
 * @returns 四位年份数字。
 */
export function currentYear(): number {
  return dayjs().year()
}

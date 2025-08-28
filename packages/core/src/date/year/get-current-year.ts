import dayjs from 'dayjs'

/**
 * 获取当前年份
 * @returns 当前年份
 */
export function getCurrentYear() {
  return dayjs().year()
}

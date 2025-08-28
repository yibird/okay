import dayjs from 'dayjs'

/**
 * 获取当前月份
 * @returns 当前月份,1-12
 */
export function getCurrentMonth() {
  return dayjs().month() + 1
}

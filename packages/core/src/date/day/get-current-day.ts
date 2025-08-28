import dayjs from 'dayjs'

/**
 * 获取当前日期
 * @returns 返回当前日期的 Dayjs 对象
 */
export function getCurrentDay() {
  return dayjs().startOf('day')
}

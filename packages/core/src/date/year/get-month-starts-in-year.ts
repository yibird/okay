import dayjs from 'dayjs'

/**
 * 获取某年所有月份的起始日期
 * @param year 年份
 * @returns 返回某年所有月份的起始日期
 */
export function getMonthStartsInYear(year: number) {
  return Array.from({ length: 12 }, (_, i) =>
    dayjs().year(year).month(i).startOf('month'),
  )
}

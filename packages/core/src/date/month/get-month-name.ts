import dayjs from 'dayjs'

/**
 * 获取月份名称
 * @param month 月份,1-12
 * @param locale 语言环境,默认en
 * @returns 月份名称
 */
export function getMonthName(month: number, locale = 'en') {
  return dayjs()
    .month(month - 1)
    .locale(locale)
    .format('MMMM')
}

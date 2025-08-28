import dayjs from 'dayjs'

/**
 * 判断指定年份是否为闰年（兼容dayjs的扩展方案）,注意:传入数字会被当做时间戳处理
 * @param date 可被dayjs解析的日期（可选）
 * @returns 返回布尔值，闰年返回true
 */
export function isLeapYear(date?: dayjs.ConfigType): boolean {
  let year: number

  if (date === undefined) {
    year = dayjs().year()
  } else {
    const d = dayjs(date)
    if (
      !d.isValid() ||
      (typeof date === 'string' && Number.isNaN(Date.parse(date)))
    ) {
      throw new Error('Invalid date input')
    }
    year = d.year()
  }
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)
}

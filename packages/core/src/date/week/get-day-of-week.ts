import dayjs from 'dayjs'

const EN_FULL_WEEKS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
const EN_SHORT_WEEKS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const ZH_FULL_WEEKS = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
]
const ZH_SHORT_WEEKS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

/**
 * 返回指定日期的星期
 * @param date 日期
 * @param locale 语言环境,en为英文,zh为中文,默认zh
 * @param style 星期几的样式,full为全称,short为简称
 * @returns 返回星期几
 */
export function getDayOfWeek(
  date?: dayjs.ConfigType,
  locale: 'en' | 'zh' = 'zh',
  style: 'full' | 'short' = 'full',
): string | undefined {
  const d = dayjs(date)
  if (!d.isValid()) return undefined
  const day = d.day()
  if (locale === 'en') {
    return style === 'short' ? EN_SHORT_WEEKS[day] : EN_FULL_WEEKS[day]
  }
  return style === 'short' ? ZH_SHORT_WEEKS[day] : ZH_FULL_WEEKS[day]
}

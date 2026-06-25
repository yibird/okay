import dayjs from 'dayjs'

const EN_FULL_WEEKS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const EN_SHORT_WEEKS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const ZH_FULL_WEEKS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const ZH_SHORT_WEEKS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

/**
 * 返回本地化星期标签。
 *
 * 无效日期会返回 `undefined`，而不是抛出错误。
 *
 * @param date Day.js 支持的日期类值，默认当前时间。
 * @param locale 输出语言：英文或中文。
 * @param style 完整标签或短标签。
 * @returns 星期标签；日期无效时返回 `undefined`。
 */
export function weekday(
  date?: dayjs.ConfigType,
  locale: 'en' | 'zh' = 'zh',
  style: 'full' | 'short' = 'full',
): string | undefined {
  const d = date === undefined ? dayjs() : dayjs(date)
  if (!d.isValid()) return undefined

  const day = d.day()
  if (locale === 'en') {
    return style === 'short' ? EN_SHORT_WEEKS[day] : EN_FULL_WEEKS[day]
  }

  return style === 'short' ? ZH_SHORT_WEEKS[day] : ZH_FULL_WEEKS[day]
}

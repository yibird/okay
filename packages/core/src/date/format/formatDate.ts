import type { ConfigType } from 'dayjs'
import { format } from './format'

const TEMPLATE = 'YYYY-MM-DD'

/**
 * 将日期类值格式化为 `YYYY-MM-DD`。
 *
 * @param input Day.js 支持的日期类值，默认当前时间。
 * @returns 格式化后的日历日期。
 * @throws 当 `input` 无法解析为有效日期时抛出错误。
 */
export function formatDate(input?: ConfigType): string {
  return format(input, TEMPLATE)
}

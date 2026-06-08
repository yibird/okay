import type { ConfigType } from 'dayjs'
import { format } from './format'

const TEMPLATE = 'YYYY-MM-DD HH:mm:ss'

/**
 * 将日期类值格式化为 `YYYY-MM-DD HH:mm:ss`。
 *
 * @param input Day.js 支持的日期类值，默认当前时间。
 * @returns 格式化后的日期时间字符串。
 * @throws 当 `input` 无法解析为有效日期时抛出错误。
 */
export function formatDateTime(input?: ConfigType): string {
  return format(input, TEMPLATE)
}

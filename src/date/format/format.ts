import dayjs from 'dayjs'

/**
 * 使用 Day.js 模板格式化日期值。
 *
 * 未传入 `input` 时会格式化当前日期时间。无效输入会抛出错误，而不是返回 `"Invalid Date"`，
 * 方便调用方尽早失败。
 *
 * @param input Day.js 支持的日期类值。
 * @param template Day.js 格式化模板，默认 `YYYY-MM-DD HH:mm:ss`。
 * @returns 格式化后的日期字符串。
 * @throws 当 `input` 无法解析为有效日期时抛出错误。
 */
export function format(input?: dayjs.ConfigType, template = 'YYYY-MM-DD HH:mm:ss'): string {
  const date = dayjs(input)
  if (!date.isValid()) {
    throw new Error('Invalid date provided')
  }

  return date.format(template)
}

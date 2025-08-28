import dayjs from 'dayjs'

/**
 * 格式化日期时间
 * @param input 日期时间
 * @param TEMPLATE 格式化模板,默认'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期时间
 */
export function format(
  input?: dayjs.ConfigType,
  TEMPLATE = 'YYYY-MM-DD HH:mm:ss',
) {
  const d = dayjs(input)
  if (!d.isValid()) {
    throw new Error('Invalid date provided')
  }
  return dayjs(input).format(TEMPLATE)
}

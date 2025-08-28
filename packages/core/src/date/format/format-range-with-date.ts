import dayjs from 'dayjs'
import { formatRange } from './format-range'

const TEMPLATE = 'YYYY-MM-DD'
/**
 * 解析日期范围，返回包含开始和结束日期的对象
 * @param inputs 日期范围，可以是以下格式之一：
 * - 单个日期，如 "2023-01-01"
 * - 包含两个日期的数组，如 ["2023-01-01", "2023-01-31"]
 * - 包含 start 和 end 属性的对象，如 { start: "2023-01-01", end: "2023-01-31" }
 * @returns 包含 startDate 和 endDate 的对象（Dayjs 实例）
 * @throws 如果输入无效或日期范围不合法
 */
export function formatRangeWithDate(
  inputs?:
    | dayjs.ConfigType
    | [dayjs.ConfigType, dayjs.ConfigType]
    | { start: dayjs.ConfigType; end: dayjs.ConfigType },
) {
  return formatRange(inputs, TEMPLATE)
}

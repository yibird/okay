import { formatRange, type DateRangeInput, type FormattedRangeResult } from './formatRange'

const DATE_RANGE_TEMPLATE = 'YYYY-MM-DD'

/**
 * 将日期范围格式化为日历日期。
 *
 * 同日范围返回 `{ startDate, endDate: null }`；跨日范围返回 `{ startDate, endDate }` 对象。
 *
 * @param inputs 单个日期、日期二元组或包含 `start` 和 `end` 的对象。
 * @returns 格式化后的日期范围。
 * @throws 当输入范围无效时抛出错误。
 */
export function dateRange(inputs?: DateRangeInput): FormattedRangeResult {
  return formatRange(inputs, DATE_RANGE_TEMPLATE)
}

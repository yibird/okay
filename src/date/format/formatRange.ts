import dayjs from 'dayjs'

/**
 * 日期范围输入，可以是单个日期、二元组或 `{ start, end }` 对象。
 */
export type DateRangeInput =
  | dayjs.ConfigType
  | [dayjs.ConfigType, dayjs.ConfigType]
  | { start: dayjs.ConfigType; end: dayjs.ConfigType }

/**
 * 格式化后的日期范围结果。
 */
export interface FormattedRangeResult {
  startDate: string
  endDate: string | null
}

/**
 * 使用可配置的 Day.js 模板格式化日期范围。
 *
 * 单个日期会被视为同日范围。同日范围返回 `{ startDate, endDate: null }` 对象；
 * 跨日期范围返回 `{ startDate, endDate }` 对象，endDate 为格式化后的字符串。
 *
 * @param inputs 单个日期、日期二元组或包含 `start` 和 `end` 的对象。
 * @param template Day.js 格式化模板。
 * @returns 格式化后的日期范围对象；同日范围 endDate 为 null。
 * @throws 当数组输入不是两个日期时抛出错误。
 * @throws 当任一日期无效或开始日期晚于结束日期时抛出错误。
 */
export function formatRange(
  inputs?: DateRangeInput,
  template = 'YYYY-MM-DD HH:mm:ss',
): FormattedRangeResult {
  let startDate: dayjs.Dayjs
  let endDate: dayjs.Dayjs

  if (Array.isArray(inputs)) {
    if (inputs.length !== 2) {
      throw new Error('Array input must contain exactly 2 dates')
    }
    startDate = dayjs(inputs[0])
    endDate = dayjs(inputs[1])
  } else if (
    typeof inputs === 'object' &&
    inputs !== null &&
    'start' in inputs &&
    'end' in inputs
  ) {
    startDate = dayjs(inputs.start)
    endDate = dayjs(inputs.end)
  } else {
    startDate = dayjs(inputs)
    endDate = startDate
  }

  if (!startDate.isValid() || !endDate.isValid()) {
    throw new Error('Invalid date(s) provided')
  }

  if (startDate.isAfter(endDate)) {
    throw new Error('Start date must be before or equal to end date')
  }

  if (startDate.isSame(endDate, 'day')) {
    return {
      startDate: startDate.format(template),
      endDate: null,
    }
  }

  return {
    startDate: startDate.format(template),
    endDate: endDate.format(template),
  }
}

import dayjs from 'dayjs'

/**
 * 解析日期范围，返回包含开始和结束日期的对象
 * @param inputs 日期范围，可以是以下格式之一：
 * - 单个日期，如 "2023-01-01"
 * - 包含两个日期的数组，如 ["2023-01-01 09:00:01", "2023-01-31 18:00:00"]
 * - 包含 start 和 end 属性的对象，如 { start: "2023-01-01 09:00:01", end: "2023-01-01 09:00:01" }
 * @returns 包含 startDate 和 endDate 的对象（Dayjs 实例）
 * @throws 如果输入无效或日期范围不合法
 */
export function formatRange(
  inputs?:
    | dayjs.ConfigType
    | [dayjs.ConfigType, dayjs.ConfigType]
    | { start: dayjs.ConfigType; end: dayjs.ConfigType },
  TEMPLATE = 'YYYY-MM-DD HH:mm:ss',
) {
  let startDate: dayjs.Dayjs
  let endDate: dayjs.Dayjs

  // 处理不同类型的输入
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
    // 单个日期，开始和结束日期相同
    startDate = dayjs(inputs)
    endDate = dayjs(inputs)
  }

  // 验证日期
  if (!startDate.isValid() || !endDate.isValid()) {
    throw new Error('Invalid date(s) provided')
  }

  // 确保开始日期不晚于结束日期
  if (startDate.isAfter(endDate)) {
    throw new Error('Start date must be before or equal to end date')
  }

  // 格式化日期范围
  if (startDate.isSame(endDate, 'day')) {
    return {
      startDate: startDate.format(TEMPLATE),
      endDate: null,
    }
  }
  return [startDate.format(TEMPLATE), endDate.format(TEMPLATE)]
}

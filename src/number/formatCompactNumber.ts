import { formatNumberValue, getCachedNumberFormatter } from './numberFormatShared'
import type { FormatCompactNumberOptions, NumberFormatValue } from './types'

/**
 * 使用 `Intl.NumberFormat` 的紧凑记法格式化数字。
 *
 * 该方法适合展示较大的计数、金额或统计值，例如将 `1200` 格式化为 `1.2K`。
 * 默认保留 1 位小数，并允许通过 `compactDisplay`、`maximumFractionDigits`
 * 等 `Intl.NumberFormat` 选项控制展示细节。
 *
 * @param value 需要格式化的数字、bigint、null 或 undefined。
 * @param options 地区、兜底文本、非有限数字处理方式以及紧凑数字格式化配置。
 * @returns 格式化后的紧凑数字文本；当输入为空值或不允许格式化的非法数值时返回兜底文本。
 */
export function formatCompactNumber(
  value: NumberFormatValue,
  options: FormatCompactNumberOptions = {},
): string {
  const { locale, fallback = '', allowNonFinite = false, ...compactOptions } = options
  const formatter = getCachedNumberFormatter(locale, {
    maximumFractionDigits: 1,
    ...compactOptions,
    notation: 'compact',
    style: 'decimal',
  })

  return formatNumberValue(value, formatter, {
    allowNonFinite,
    fallback,
  })
}

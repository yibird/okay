import { formatNumberValue, getCachedNumberFormatter } from './numberFormatShared'
import type { FormatPercentOptions, PercentFormatValue } from './types'

/**
 * 将数字格式化为百分比文本。
 *
 * 默认把输入当作比例值处理，例如 `0.125` 会格式化为 `12.5%`。
 * 当输入已经是百分比数值时，可将 `valueMode` 设置为 `percent`。
 * `null`、`undefined` 和非有限数字默认返回 `fallback`。
 *
 * @param value 需要格式化的数字。
 * @param options 地区、兜底行为、百分比模式和格式化配置。
 * @returns 格式化后的百分比文本或兜底文本。
 */
export function formatPercent(
  value: PercentFormatValue,
  options: FormatPercentOptions = {},
): string {
  const {
    locale,
    fallback = '',
    allowNonFinite = false,
    valueMode = 'ratio',
    ...percentOptions
  } = options
  const formatter = getCachedNumberFormatter(locale, {
    ...percentOptions,
    style: 'percent',
  })
  const formattedValue = typeof value === 'number' && valueMode === 'percent' ? value / 100 : value

  return formatNumberValue(formattedValue, formatter, {
    allowNonFinite,
    fallback,
  })
}

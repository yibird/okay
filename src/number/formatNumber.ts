import { formatNumberValue, getCachedNumberFormatter } from './numberFormatShared'
import type { FormatNumberOptions, NumberFormatValue } from './types'

/**
 * 使用缓存的 `Intl.NumberFormat` 格式化十进制数字。
 *
 * `null`、`undefined`、非数字值和非有限数字默认返回 `fallback`；
 * 开启 `allowNonFinite` 后，非有限数字会交给 `Intl` 处理。
 *
 * @param value 需要格式化的 number 或 bigint。
 * @param options 地区、兜底行为和十进制格式化配置。
 * @returns 格式化后的数字文本或兜底文本。
 */
export function formatNumber(value: NumberFormatValue, options: FormatNumberOptions = {}): string {
  const { locale, fallback = '', allowNonFinite = false, ...numberOptions } = options
  const formatter = getCachedNumberFormatter(locale, {
    ...numberOptions,
    style: 'decimal',
  })

  return formatNumberValue(value, formatter, {
    allowNonFinite,
    fallback,
  })
}

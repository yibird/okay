import { formatNumberValue, getCachedNumberFormatter } from './numberFormatShared'
import type { FormatCurrencyOptions, NumberFormatValue } from './types'

type FormatCurrencyOptionsWithoutCurrency = Omit<FormatCurrencyOptions, 'currency'>

/**
 * 将数字格式化为货币文本。
 *
 * 默认货币为 `USD`。也可以使用 `formatCurrency(12, 'CNY')` 这样的简写重载。
 *
 * @param value 需要格式化的 number 或 bigint。
 * @param options 货币格式化配置。
 * @returns 格式化后的货币文本或兜底文本。
 */
export function formatCurrency(value: NumberFormatValue, options?: FormatCurrencyOptions): string
/**
 * 使用独立货币代码参数格式化货币文本。
 *
 * 该重载会把货币代码和其他 `Intl.NumberFormat` 配置分开，便于简洁调用。
 *
 * @param value 需要格式化的 number 或 bigint。
 * @param currency ISO 4217 货币代码。
 * @param options 额外的货币格式化配置。
 * @returns 格式化后的货币文本或兜底文本。
 */
export function formatCurrency(
  value: NumberFormatValue,
  currency: string,
  options?: FormatCurrencyOptionsWithoutCurrency,
): string
export function formatCurrency(
  value: NumberFormatValue,
  currencyOrOptions: string | FormatCurrencyOptions = {},
  options: FormatCurrencyOptionsWithoutCurrency = {},
): string {
  const formatOptions =
    typeof currencyOrOptions === 'string'
      ? {
          ...options,
          currency: currencyOrOptions,
        }
      : currencyOrOptions
  const {
    locale,
    fallback = '',
    allowNonFinite = false,
    currency = 'USD',
    ...currencyOptions
  } = formatOptions
  const formatter = getCachedNumberFormatter(locale, {
    ...currencyOptions,
    currency,
    style: 'currency',
  })

  return formatNumberValue(value, formatter, {
    allowNonFinite,
    fallback,
  })
}

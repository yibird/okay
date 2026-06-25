/**
 * 十进制数字格式化不允许调用方直接覆盖的 `Intl.NumberFormatOptions` 字段。
 *
 * 这些字段由具体工具函数负责固定，例如 `formatNumber` 固定为十进制样式，
 * `formatCompactNumber` 固定为紧凑记法，避免调用方传入互相冲突的 style 配置。
 *
 * @internal
 */
type DecimalNumberReservedOptionKey =
  | 'style'
  | 'currency'
  | 'currencyDisplay'
  | 'currencySign'
  | 'unit'
  | 'unitDisplay'

/**
 * 十进制格式化允许透传给 `Intl.NumberFormat` 的配置。
 *
 * @internal
 */
type DecimalNumberIntlOptions = Omit<Intl.NumberFormatOptions, DecimalNumberReservedOptionKey>

/**
 * 货币格式化允许透传给 `Intl.NumberFormat` 的配置。
 *
 * `style` 和 `currency` 由 `formatCurrency` 统一设置，调用方只需要提供货币代码和展示细节。
 *
 * @internal
 */
type CurrencyNumberIntlOptions = Omit<Intl.NumberFormatOptions, 'style' | 'currency'>

/**
 * 数字格式化工具接受的通用数值类型。
 */
export type NumberFormatValue = number | bigint | null | undefined

/**
 * 百分比格式化工具接受的数值类型。
 */
export type PercentFormatValue = number | null | undefined

/**
 * 数字格式化工具共享的行为配置。
 */
export interface FormatNumberBehaviorOptions {
  /**
   * 传递给 `Intl.NumberFormat` 的地区配置。
   */
  locale?: Intl.LocalesArgument
  /**
   * 输入为空值或非法数值时返回的兜底文本。
   */
  fallback?: string
  /**
   * 是否允许 `NaN`、`Infinity` 和 `-Infinity` 交给 `Intl` 格式化。
   */
  allowNonFinite?: boolean
}

/**
 * 十进制数字格式化配置。
 */
export interface FormatNumberOptions
  extends FormatNumberBehaviorOptions, DecimalNumberIntlOptions {}

/**
 * 百分比格式化配置。
 */
export interface FormatPercentOptions
  extends FormatNumberBehaviorOptions, DecimalNumberIntlOptions {
  /**
   * `ratio` 会把 0.12 格式化为 12%；`percent` 会把 12 格式化为 12%。
   */
  valueMode?: 'ratio' | 'percent'
}

/**
 * 货币格式化配置。
 */
export interface FormatCurrencyOptions
  extends FormatNumberBehaviorOptions, CurrencyNumberIntlOptions {
  /**
   * ISO 4217 货币代码，默认 `USD`。
   */
  currency?: string
}

/**
 * 紧凑数字格式化配置。
 */
export interface FormatCompactNumberOptions
  extends FormatNumberBehaviorOptions, Omit<DecimalNumberIntlOptions, 'notation'> {}

/**
 * 创建可复用数字格式化器的配置。
 */
export interface CreateNumberFormatterOptions
  extends FormatNumberBehaviorOptions, Intl.NumberFormatOptions {}

/**
 * 可复用的数字格式化函数。
 */
export type NumberFormatter = (value: NumberFormatValue) => string

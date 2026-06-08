import { formatNumberValue, getCachedNumberFormatter } from './numberFormatShared'
import type { CreateNumberFormatterOptions, NumberFormatter } from './types'

/**
 * 创建一个可复用的数字格式化函数。
 *
 * 当同一组格式化配置会在表格、循环或渲染热路径中反复使用时，提前创建格式化函数可以复用
 * 内部缓存的 `Intl.NumberFormat` 实例，减少重复解析配置和构造 formatter 的开销。
 *
 * @param options 共享行为配置和完整的 `Intl.NumberFormat` 配置。
 * @returns 接收数字值并返回格式化文本的函数。
 */
export function createNumberFormatter(options: CreateNumberFormatterOptions = {}): NumberFormatter {
  const { locale, fallback = '', allowNonFinite = false, ...intlOptions } = options
  const formatter = getCachedNumberFormatter(locale, intlOptions)

  return (value) =>
    formatNumberValue(value, formatter, {
      allowNonFinite,
      fallback,
    })
}

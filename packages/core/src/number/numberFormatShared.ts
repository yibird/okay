import type { FormatNumberBehaviorOptions, NumberFormatValue } from './types'

const MAX_FORMATTER_CACHE_SIZE = 128

const NUMBER_FORMAT_OPTION_KEYS = [
  'compactDisplay',
  'currency',
  'currencyDisplay',
  'currencySign',
  'localeMatcher',
  'maximumFractionDigits',
  'maximumSignificantDigits',
  'minimumFractionDigits',
  'minimumIntegerDigits',
  'minimumSignificantDigits',
  'notation',
  'numberingSystem',
  'roundingIncrement',
  'roundingMode',
  'roundingPriority',
  'signDisplay',
  'style',
  'trailingZeroDisplay',
  'unit',
  'unitDisplay',
  'useGrouping',
] as const

const knownOptionKeys = new Set<string>(NUMBER_FORMAT_OPTION_KEYS)
const formatterCache = new Map<string, Intl.NumberFormat>()

const createLocaleKey = (locale: Intl.LocalesArgument | undefined) => {
  if (locale === undefined) return ''
  return Array.isArray(locale) ? locale.join('\u0001') : String(locale)
}

const stringifyOptionValue = (value: unknown) => {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value)
  }
  return JSON.stringify(value) ?? String(value)
}

const createOptionsKey = (options: Intl.NumberFormatOptions) => {
  const source = options as Record<string, unknown>
  let key = ''

  for (const optionKey of NUMBER_FORMAT_OPTION_KEYS) {
    const value = source[optionKey]
    if (value !== undefined) {
      key += `${optionKey}:${stringifyOptionValue(value)};`
    }
  }

  const extraKeys = Object.keys(source)
    .filter((optionKey) => !knownOptionKeys.has(optionKey) && source[optionKey] !== undefined)
    .sort()

  for (const optionKey of extraKeys) {
    key += `${optionKey}:${stringifyOptionValue(source[optionKey])};`
  }

  return key
}

/**
 * 按地区和配置获取缓存的 `Intl.NumberFormat` 实例。
 *
 * 缓存键会按稳定顺序拼接已知 `Intl.NumberFormatOptions`，未知配置键会按字母序追加。
 * 达到固定容量上限后会清空缓存，避免长期运行时无限增长。
 *
 * @param locale 传给 `Intl.NumberFormat` 的地区配置。
 * @param options 数字格式化配置。
 * @returns 缓存命中或新建的格式化器。
 */
export function getCachedNumberFormatter(
  locale: Intl.LocalesArgument | undefined,
  options: Intl.NumberFormatOptions,
): Intl.NumberFormat {
  const cacheKey = `${createLocaleKey(locale)}|${createOptionsKey(options)}`
  const cached = formatterCache.get(cacheKey)

  if (cached) return cached

  if (formatterCache.size >= MAX_FORMATTER_CACHE_SIZE) {
    formatterCache.delete(formatterCache.keys().next().value!)
  }

  const formatter = new Intl.NumberFormat(locale, options)
  formatterCache.set(cacheKey, formatter)
  return formatter
}

/**
 * 清空内部数字格式化器缓存。
 *
 * 主要用于测试，或在长期运行进程中切换地区相关运行状态后主动释放格式化器实例。
 */
export function clearNumberFormatCache(): void {
  formatterCache.clear()
}

/**
 * 应用共享兜底规则后格式化数值。
 *
 * `bigint` 会始终交给 `Intl.NumberFormat`；`number` 在非有限且未开启 `allowNonFinite` 时返回
 * `fallback`；`null` 和 `undefined` 也会返回 `fallback`。
 *
 * @param value 需要格式化的值。
 * @param formatter 缓存的格式化器实例。
 * @param options 兜底文本和非有限数字处理配置。
 * @returns 格式化后的文本或兜底文本。
 */
export function formatNumberValue(
  value: NumberFormatValue,
  formatter: Intl.NumberFormat,
  options: Pick<FormatNumberBehaviorOptions, 'allowNonFinite' | 'fallback'>,
): string {
  const { allowNonFinite = false, fallback = '' } = options

  if (value === null || value === undefined) return fallback
  if (typeof value === 'bigint') return formatter.format(value)
  if (typeof value !== 'number') return fallback
  if (!allowNonFinite && !Number.isFinite(value)) return fallback

  return formatter.format(value)
}

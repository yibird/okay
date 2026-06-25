import type dayjs from 'dayjs'
import { parseDate } from './businessDayShared'

/**
 * 相对时间支持的时间单位。
 */
export type RelativeTimeUnit =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'

/**
 * 相对时间数值舍入策略。
 */
export type RelativeTimeRounding = 'ceil' | 'floor' | 'round' | 'trunc'

/**
 * 相对时间格式化配置。
 */
export interface RelativeTimeOptions {
  /**
   * 参考日期，默认当前时间。
   */
  baseDate?: dayjs.ConfigType
  /**
   * 传给 `Intl.RelativeTimeFormat` 的地区配置。
   */
  locale?: Intl.LocalesArgument
  /**
   * 相对时间单位；未传入时会自动选择合适单位。
   */
  unit?: RelativeTimeUnit
  /**
   * Intl numeric 配置，默认 `always` 以获得可预测输出。
   */
  numeric?: Intl.RelativeTimeFormatNumeric
  /**
   * Intl style 配置。
   */
  style?: Intl.RelativeTimeFormatStyle
  /**
   * 相对数值的舍入策略。
   */
  rounding?: RelativeTimeRounding
  /**
   * 目标日期或参考日期无效时返回的兜底文本。
   */
  fallback?: string
}

const formatterCache = new Map<string, Intl.RelativeTimeFormat>()
const MAX_FORMATTER_CACHE_SIZE = 64

const getCachedRelativeTimeFormatter = (
  locale: Intl.LocalesArgument | undefined,
  numeric: Intl.RelativeTimeFormatNumeric,
  style: Intl.RelativeTimeFormatStyle,
) => {
  const localeKey =
    locale === undefined ? '' : Array.isArray(locale) ? locale.join('\u0001') : String(locale)
  const cacheKey = `${localeKey}|${numeric}|${style}`
  const cached = formatterCache.get(cacheKey)

  if (cached) return cached

  if (formatterCache.size >= MAX_FORMATTER_CACHE_SIZE) {
    formatterCache.delete(formatterCache.keys().next().value!)
  }

  const formatter = new Intl.RelativeTimeFormat(locale, {
    numeric,
    style,
  })
  formatterCache.set(cacheKey, formatter)
  return formatter
}

const autoUnitThresholds = [
  { maxSeconds: 60, unit: 'second' },
  { maxSeconds: 3_600, unit: 'minute' },
  { maxSeconds: 86_400, unit: 'hour' },
  { maxSeconds: 604_800, unit: 'day' },
  { maxSeconds: 2_592_000, unit: 'week' },
  { maxSeconds: 31_536_000, unit: 'month' },
] as const

const selectRelativeTimeUnit = (absoluteSeconds: number): RelativeTimeUnit => {
  for (const threshold of autoUnitThresholds) {
    if (absoluteSeconds < threshold.maxSeconds) {
      return threshold.unit
    }
  }

  return 'year'
}

const getDiffByUnit = (target: dayjs.Dayjs, base: dayjs.Dayjs, unit: RelativeTimeUnit): number => {
  switch (unit) {
    case 'quarter':
      return target.diff(base, 'month', true) / 3
    case 'week':
      return target.diff(base, 'day', true) / 7
    default:
      return target.diff(base, unit, true)
  }
}

const roundRelativeValue = (value: number, rounding: RelativeTimeRounding) => {
  const sign = value < 0 ? -1 : 1
  const absoluteValue = Math.abs(value)

  switch (rounding) {
    case 'ceil':
      return sign * Math.ceil(absoluteValue)
    case 'floor':
      return sign * Math.floor(absoluteValue)
    case 'trunc':
      return sign * Math.trunc(absoluteValue)
    default:
      return sign * Math.round(absoluteValue)
  }
}

/**
 * 将日期格式化为相对时间，例如 `5 minutes ago` 或 `in 2 days`。
 *
 * @param date 目标日期。
 * @param options 参考日期、地区、单位和格式化配置。
 * @returns 本地化相对时间文本或兜底文本。
 */
export function relativeTime(date: dayjs.ConfigType, options: RelativeTimeOptions = {}): string {
  const {
    baseDate = new Date(),
    fallback = '',
    locale,
    numeric = 'always',
    rounding = 'round',
    style = 'long',
    unit,
  } = options
  const target = parseDate(date)
  const base = parseDate(baseDate)

  if (target === null || base === null) return fallback

  const selectedUnit = unit ?? selectRelativeTimeUnit(Math.abs(target.diff(base, 'second', true)))
  const value = roundRelativeValue(getDiffByUnit(target, base, selectedUnit), rounding)
  const formatter = getCachedRelativeTimeFormatter(locale, numeric, style)

  return formatter.format(value, selectedUnit)
}

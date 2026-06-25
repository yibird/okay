import type { MaskOptions } from './maskTypes'

const DEFAULT_MASK_CHAR = '*'

/**
 * 归一化数量配置。
 *
 * 小数会向下取整，负数会按 `0` 处理，非有限数字会抛出类型错误。
 *
 * @param name 配置项名称，用于错误提示。
 * @param value 调用方传入的数量。
 * @param fallback 未传入时使用的默认数量。
 * @returns 可安全参与计算的非负整数。
 */
export const normalizeCount = (
  name: string,
  value: number | undefined,
  fallback: number,
): number => {
  const resolved = value ?? fallback

  if (!Number.isFinite(resolved)) {
    throw new TypeError(`${name} 必须是有限数字`)
  }

  return Math.max(0, Math.floor(resolved))
}

/**
 * 归一化遮盖字符。
 *
 * 未传入时使用默认遮盖字符；传入空字符串会导致输出无法表达遮盖区域，因此会抛出错误。
 *
 * @param maskChar 调用方传入的遮盖字符。
 * @returns 最终用于遮盖的非空字符串。
 */
export const normalizeMaskChar = (maskChar = DEFAULT_MASK_CHAR): string => {
  if (maskChar.length === 0) {
    throw new TypeError('maskChar 不能为空')
  }

  return maskChar
}

/**
 * 归一化最终渲染的遮盖长度。
 *
 * `auto` 表示使用实际被隐藏的原始字符数量；传入数字时可固定遮盖输出长度。
 *
 * @param value 调用方传入的遮盖长度配置。
 * @param hiddenLength 实际被隐藏的原始字符数量。
 * @returns 最终需要渲染的遮盖字符数量。
 */
export const normalizeMaskLength = (
  value: MaskOptions['maskLength'],
  hiddenLength: number,
): number => {
  if (value === undefined || value === 'auto') return hiddenLength
  if (!Number.isFinite(value)) {
    throw new TypeError('maskLength 必须是有限数字或 "auto"')
  }

  return Math.max(0, Math.floor(value))
}

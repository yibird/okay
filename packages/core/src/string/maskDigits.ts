import { maskText } from './maskText'
import { normalizeCount, normalizeMaskChar } from './maskNormalize'
import { emptyText, isNil, toText } from './maskValue'
import { resolveVisibleCounts } from './maskVisible'
import type { MaskDigitOptions, MaskValue } from './maskTypes'

const isAsciiDigit = (char: string) => char >= '0' && char <= '9'

const countDigits = (chars: readonly string[]) => {
  let count = 0

  for (let index = 0; index < chars.length; index++) {
    if (isAsciiDigit(chars[index])) {
      count++
    }
  }

  return count
}

const maskDigitChars = (
  chars: string[],
  visibleStart: number,
  visibleEnd: number,
  digitCount: number,
  maskChar: string,
) => {
  const firstHiddenDigit = visibleStart
  const lastHiddenDigit = digitCount - visibleEnd
  let digitIndex = 0

  for (let index = 0; index < chars.length; index++) {
    if (!isAsciiDigit(chars[index])) continue

    if (digitIndex >= firstHiddenDigit && digitIndex < lastHiddenDigit) {
      chars[index] = maskChar
    }

    digitIndex++
  }

  return chars.join('')
}

/**
 * 按数字维度执行遮盖。
 *
 * 该方法只负责“数字型敏感信息”的通用规则：默认保留格式中的非数字字符，只统计和遮盖
 * ASCII 数字，供手机号、银行卡号等派生方法复用。
 *
 * @param value 需要遮盖的原始值。
 * @param defaults 派生方法提供的默认开头和结尾保留数量。
 * @param options 数字保留数量、遮盖字符、格式保留和空值返回配置。
 * @returns 遮盖后的字符串。
 */
export const maskDigits = (
  value: MaskValue,
  defaults: Required<Pick<MaskDigitOptions, 'keepStart' | 'keepEnd'>>,
  options: MaskDigitOptions = {},
): string => {
  if (isNil(value)) {
    return emptyText(options.emptyValue)
  }

  const text = toText(value)
  if (text.length === 0) return text

  const keepStart = normalizeCount('keepStart', options.keepStart, defaults.keepStart)
  const keepEnd = normalizeCount('keepEnd', options.keepEnd, defaults.keepEnd)
  const minMaskLength = normalizeCount('minMaskLength', options.minMaskLength, 1)
  const maskChar = normalizeMaskChar(options.maskChar)

  if (options.preserveFormat === false) {
    return maskText(text, {
      keepStart,
      keepEnd,
      maskChar,
      minMaskLength,
    })
  }

  const chars = Array.from(text)
  const digitCount = countDigits(chars)

  if (digitCount === 0) {
    return maskText(text, {
      keepStart: 0,
      keepEnd: 0,
      maskChar,
      minMaskLength,
    })
  }

  const { startCount, endCount } = resolveVisibleCounts(
    digitCount,
    keepStart,
    keepEnd,
    minMaskLength,
  )

  return maskDigitChars(chars, startCount, endCount, digitCount, maskChar)
}

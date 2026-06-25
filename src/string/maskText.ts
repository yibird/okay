import { normalizeCount, normalizeMaskChar, normalizeMaskLength } from './maskNormalize'
import { resolveVisibleCounts } from './maskVisible'
import type { MaskOptions } from './maskTypes'

/**
 * 对已经转换成字符串的内容执行通用遮盖。
 *
 * 该方法只负责字符串遮盖，不处理 `null`、`undefined` 等输入值转换，方便公开方法和
 * 其他派生遮盖方法复用。
 *
 * @param text 需要遮盖的字符串。
 * @param options 保留数量、遮盖字符、固定遮盖长度等配置。
 * @returns 遮盖后的字符串。
 */
// Returns true when the string contains no multi-byte Unicode code points,
// allowing cheaper substring operations instead of Array.from iteration.
const isAscii = (text: string) => {
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) > 127) return false
  }
  return true
}

// Count Unicode code points without allocating an array.
const countCodePoints = (text: string) => {
  let count = 0
  for (const _ of text) count++
  return count
}

export const maskText = (text: string, options: MaskOptions = {}): string => {
  if (text.length === 0) return text

  const keepStart = normalizeCount('keepStart', options.keepStart, 0)
  const keepEnd = normalizeCount('keepEnd', options.keepEnd, 0)
  const minMaskLength = normalizeCount('minMaskLength', options.minMaskLength, 0)
  const maskChar = normalizeMaskChar(options.maskChar)

  const ascii = isAscii(text)
  const length = ascii ? text.length : countCodePoints(text)

  const { startCount, endCount, hiddenCount } = resolveVisibleCounts(
    length,
    keepStart,
    keepEnd,
    minMaskLength,
  )

  if (hiddenCount <= 0) return text

  const renderedMaskLength = normalizeMaskLength(options.maskLength, hiddenCount)
  const mask = maskChar.repeat(renderedMaskLength)

  if (ascii) {
    const visibleStart = startCount > 0 ? text.slice(0, startCount) : ''
    const visibleEnd = endCount > 0 ? text.slice(text.length - endCount) : ''
    return `${visibleStart}${mask}${visibleEnd}`
  }

  // Unicode path: iterate code points once without allocating full array
  const chars = Array.from(text)
  const visibleStart = startCount > 0 ? chars.slice(0, startCount).join('') : ''
  const visibleEnd = endCount > 0 ? chars.slice(chars.length - endCount).join('') : ''
  return `${visibleStart}${mask}${visibleEnd}`
}

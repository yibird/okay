import { maskText } from './maskText'
import { emptyText, isNil, toText } from './maskValue'
import type { MaskEmailOptions, MaskValue } from './maskTypes'

const findSingleAtSign = (text: string) => {
  const atIndex = text.indexOf('@')

  if (atIndex <= 0 || atIndex === text.length - 1) return -1
  if (text.indexOf('@', atIndex + 1) !== -1) return -1

  return atIndex
}

/**
 * 遮盖邮箱地址的本地部分，并保留域名。
 *
 * 默认保留本地部分的第一个字符，例如 `alice@example.com` 会变成 `a****@example.com`。
 * 如果输入不是“有且只有一个 @，且本地部分和域名均非空”的邮箱形态，会回退到通用遮盖逻辑，
 * 避免直接暴露原始内容。
 *
 * @param email 需要遮盖的邮箱地址。
 * @param options 本地部分保留数量、遮盖字符和空值返回配置。
 * @returns 遮盖后的邮箱地址。
 */
export function maskEmail(email: MaskValue, options: MaskEmailOptions = {}): string {
  if (isNil(email)) {
    return emptyText(options.emptyValue)
  }

  const text = toText(email)
  const atIndex = findSingleAtSign(text)
  const keepStart = options.keepStart ?? 1
  const keepEnd = options.keepEnd ?? 0
  const minMaskLength = options.minMaskLength ?? 1

  if (atIndex === -1) {
    return maskText(text, {
      ...options,
      keepStart,
      keepEnd,
      minMaskLength,
    })
  }

  return `${maskText(text.slice(0, atIndex), {
    ...options,
    keepStart,
    keepEnd,
    minMaskLength,
  })}${text.slice(atIndex)}`
}

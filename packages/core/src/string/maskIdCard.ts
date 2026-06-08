import { mask } from './mask'
import type { MaskOptions, MaskValue } from './maskTypes'

/**
 * 遮盖中国居民身份证号。
 *
 * 默认保留前 `6` 位和后 `4` 位，适合常见的身份证展示场景。
 * 可以通过 `keepStart`、`keepEnd`、`maskChar` 等配置覆盖默认规则。
 *
 * @param idCard 需要遮盖的身份证号。
 * @param options 字符保留数量、遮盖字符、固定遮盖长度和空值返回配置。
 * @returns 遮盖后的身份证号。
 */
export function maskIdCard(idCard: MaskValue, options: MaskOptions = {}): string {
  return mask(idCard, {
    keepStart: 6,
    keepEnd: 4,
    minMaskLength: 1,
    ...options,
  })
}

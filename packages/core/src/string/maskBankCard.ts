import { maskDigits } from './maskDigits'
import type { MaskDigitOptions, MaskValue } from './maskTypes'

/**
 * 遮盖银行卡号。
 *
 * 默认保留前 `4` 位和后 `4` 位数字，并保留空格、短横线等原始分隔符。
 * 该实现只识别 ASCII 数字，避免不同地区数字字符带来的格式歧义。
 *
 * @param bankCard 需要遮盖的银行卡号。
 * @param options 数字保留数量、遮盖字符、格式保留和空值返回配置。
 * @returns 遮盖后的银行卡号。
 */
export function maskBankCard(bankCard: MaskValue, options: MaskDigitOptions = {}): string {
  return maskDigits(bankCard, { keepStart: 4, keepEnd: 4 }, options)
}

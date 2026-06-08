import { maskDigits } from './maskDigits'
import type { MaskDigitOptions, MaskValue } from './maskTypes'

export function maskPhone(phone: MaskValue, options: MaskDigitOptions = {}): string {
  return maskDigits(phone, { keepStart: 3, keepEnd: 4 }, options)
}

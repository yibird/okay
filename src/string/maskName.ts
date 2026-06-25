import { mask } from './mask'
import type { MaskNameOptions, MaskValue } from './maskTypes'

export function maskName(name: MaskValue, options: MaskNameOptions = {}): string {
  return mask(name, { keepStart: 1, keepEnd: 0, minMaskLength: 1, ...options })
}

import { maskText } from './maskText'
import type { MaskOptions, MaskValue } from './maskTypes'
import { emptyText, isNil, toText } from './maskValue'

export function mask(value: MaskValue, options: MaskOptions = {}): string {
  if (isNil(value)) return emptyText(options.emptyValue)
  return maskText(toText(value), options)
}

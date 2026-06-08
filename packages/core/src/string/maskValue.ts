import type { MaskValue } from './maskTypes'

export const isNil = (value: unknown): value is null | undefined =>
  value === null || value === undefined

export const emptyText = (emptyValue: string | undefined) => emptyValue ?? ''

export const toText = (value: Exclude<MaskValue, null | undefined>) => String(value)

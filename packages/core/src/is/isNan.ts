/**
 * 判断值是否为数字类型的 `NaN`。
 *
 * @param value 需要检查的值。
 * @returns 只有 `Number.isNaN(value)` 为真时返回 `true`。
 */
export function isNaN(value: unknown): value is number {
  return typeof value === 'number' && Number.isNaN(value)
}

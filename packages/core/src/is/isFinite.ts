/**
 * 判断值是否为有限数字。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是数字且不是 `NaN` 或无穷大时返回 `true`。
 */
export function isFinite(target: unknown): target is number {
  return typeof target === 'number' && Number.isFinite(target)
}

/**
 * 判断值是否为 number 原始值。
 *
 * `NaN` 和无穷大仍然属于 number；如果需要排除它们，请使用 `isFinite`。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是 number 原始值时返回 `true`。
 */
export function isNumber(target: unknown): target is number {
  return typeof target === 'number'
}

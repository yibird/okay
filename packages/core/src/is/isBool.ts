/**
 * 判断值是否为布尔原始值。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是 `true` 或 `false` 时返回 `true`。
 */
export function isBool(target: unknown): target is boolean {
  return typeof target === 'boolean'
}

/**
 * 判断值是否为 string 原始值。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是 string 原始值时返回 `true`。
 */
export function isString(target: unknown): target is string {
  return typeof target === 'string'
}

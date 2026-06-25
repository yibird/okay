/**
 * 判断值是否为 `bigint` 原始值。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是 `bigint` 原始值时返回 `true`。
 */
export function isBigint(target: unknown): target is bigint {
  return typeof target === 'bigint'
}

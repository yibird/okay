/**
 * 判断值是否严格等于 `null`。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是 `null` 时返回 `true`。
 */
export function isNull(target: unknown): target is null {
  return target === null
}

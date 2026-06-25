/**
 * 判断值是否严格等于 `undefined`。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是 `undefined` 时返回 `true`。
 */
export function isUndefined(target?: unknown): target is undefined {
  return typeof target === 'undefined'
}

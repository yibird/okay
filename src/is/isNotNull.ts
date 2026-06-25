/**
 * 判断值是否不是 `null`。
 *
 * `undefined` 会返回 `true`；如果也要排除 `undefined`，请使用 `isDefined` 或 `isNil`。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 不是 `null` 时返回 `true`。
 */
export function isNotNull<T>(target: T): target is Exclude<T, null> {
  return target !== null
}

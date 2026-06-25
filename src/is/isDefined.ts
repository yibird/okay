/**
 * 判断值是否不是 `undefined`。
 *
 * `null` 会被视为已定义；如果需要同时排除 `null` 和 `undefined`，请使用 `isNullOrUndef` 或 `isNil`。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 不是 `undefined` 时返回 `true`。
 */
export function isDefined<T>(target: T): target is Exclude<T, undefined> {
  return typeof target !== 'undefined'
}

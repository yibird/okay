/**
 * 判断值是否同时为 `null` 和 `undefined`。
 *
 * 没有任何 JavaScript 值能同时满足该条件，因此该方法始终返回 `false`。
 * 它仅为向后兼容保留；实际空值判断请优先使用 `isNil` 或 `isNullOrUndef`。
 *
 * @deprecated 请改用 `isNil` 或 `isNullOrUndef`。
 * @param target 需要检查的值。
 * @returns 始终返回 `false`。
 */
export function isNullAndUndef(_target: unknown): _target is never {
  return false
}

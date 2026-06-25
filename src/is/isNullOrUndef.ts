/**
 * 判断值是否为 `null` 或 `undefined`。
 *
 * @deprecated 请改用 `isNil`，两者功能完全相同。
 * @param target 需要检查的值。
 * @returns 当 `target` 是空值时返回 `true`。
 */
export function isNullOrUndef(target: unknown): target is null | undefined {
  return target === null || target === undefined
}

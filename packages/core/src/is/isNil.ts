/**
 * 判断值是否为 `null` 或 `undefined`。
 *
 * 这遵循常见工具库里 “nil” 的含义，等价于 `isNullOrUndef`。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是 `null` 或 `undefined` 时返回 `true`。
 */
export function isNil(target: unknown): target is null | undefined {
  return target === null || target === undefined
}

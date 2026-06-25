/**
 * 判断值是否为数组。
 *
 * 这是 `Array.isArray` 的类型化轻量包装，因此可以识别 iframe 等不同 JavaScript realm 中的数组。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是数组时返回 `true`。
 */
export function isArray<T = unknown>(target: unknown): target is T[] {
  return Array.isArray(target)
}

/**
 * 判断值是否可调用。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是函数时返回 `true`。
 */
export function isFunc<T extends (...args: never[]) => unknown = (...args: never[]) => unknown>(
  target: unknown,
): target is T {
  return typeof target === 'function'
}

/**
 * 判断值是否为 symbol 原始值。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是 symbol 原始值时返回 `true`。
 */
export function isSymbol(target: unknown): target is symbol {
  return typeof target === 'symbol'
}

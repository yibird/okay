/**
 * 返回值的 `Object.prototype.toString` 内建类型标签。
 *
 * 常见结果包括 `Array`、`Object`、`Date`、`Map`、`Null` 和 `Undefined`。
 *
 * @param target 需要检查的值。
 * @returns 去掉 `[object ...]` 包装后的原始类型标签。
 */
export const rawType = (target: unknown): string => {
  return Object.prototype.toString.call(target).slice(8, -1)
}

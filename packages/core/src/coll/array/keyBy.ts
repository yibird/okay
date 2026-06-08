/**
 * 使用每一项计算出的键将数组转换为对象。
 *
 * 当多项生成相同键时，后面的项会覆盖前面的项，符合常见工具库 `keyBy` 行为。
 * 未传入 `valMapper` 时会把原始项作为值。
 *
 * @param arr 源数组。
 * @param keyMapper 为每一项生成对象键的函数。
 * @param valMapper 可选的值映射函数。
 * @returns 以映射键组织的对象。
 */
export function keyBy<T>(
  arr: T[],
  keyMapper: (item: T) => string | number | symbol,
): Record<string | number | symbol, T>
export function keyBy<T, V>(
  arr: T[],
  keyMapper: (item: T) => string | number | symbol,
  valMapper: (item: T) => V,
): Record<string | number | symbol, V>
export function keyBy<T, V = T>(
  arr: T[],
  keyMapper: (item: T) => string | number | symbol,
  valMapper?: (item: T) => V,
): Record<string | number | symbol, T | V> {
  const result = Object.create(null) as Record<string | number | symbol, T | V>

  for (const item of arr) {
    result[keyMapper(item)] = valMapper ? valMapper(item) : item
  }

  return result
}

import { rawType } from './rawType'

/**
 * 判断值是否为 `Map`。
 *
 * 这里使用 `rawType` 而不是 `instanceof`，因此可以识别来自其他 JavaScript realm 的值。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是 `Map` 时返回 `true`。
 */
export function isMap<K = any, V = any>(target: unknown): target is Map<K, V> {
  return rawType(target) === 'Map'
}

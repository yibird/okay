import { rawType } from './raw-type'

/**
 * 判断目标值是否是一个Map
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isMap<K = any, V = any>(target: unknown): target is Map<K, V> {
  return rawType(target) === 'Map'
}

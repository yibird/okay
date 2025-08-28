import { rawType } from './raw-type'

/**
 * 判断目标值是否为WeakMap
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isWeakMap<K extends object = any, V = any>(
  target: unknown,
): target is WeakMap<K, V> {
  return rawType(target) === 'WeakMap'
}

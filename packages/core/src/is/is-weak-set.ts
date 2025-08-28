import { rawType } from './raw-type'

/**
 * 判断目标值是否为WeakSet
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isWeakSet<T extends object = any>(
  target: unknown,
): target is WeakSet<T> {
  return rawType(target) === 'WeakSet'
}

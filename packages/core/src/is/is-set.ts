import { rawType } from './raw-type'

/**
 * 判断目标值是否为Set
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isSet<T = any>(target: unknown): target is Set<T> {
  return rawType(target) === 'Set'
}

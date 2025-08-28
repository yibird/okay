import { isFunc } from './is-func'
import { isNotNull } from './is-not-null'
import { rawType } from './raw-type'

/**
 * 判断目标值是否为Promise
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isPromise<T = any>(target: unknown): target is Promise<T> {
  return (
    rawType(target) === 'Promise' &&
    isNotNull(target) &&
    typeof target === 'object' &&
    isFunc((target as any).then) &&
    isFunc((target as any).catch)
  )
}

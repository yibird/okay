import { isFunc } from './isFunc'
import { rawType } from './rawType'

/**
 * 判断值是否为原生 `Promise`。
 *
 * 该守卫会刻意要求原始类型为 `Promise`；任意 thenable 不会被视为 Promise。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是原生 Promise 时返回 `true`。
 */
export function isPromise<T = unknown>(target: unknown): target is Promise<T> {
  if (rawType(target) !== 'Promise') return false

  const promise = target as object
  return isFunc(Reflect.get(promise, 'then')) && isFunc(Reflect.get(promise, 'catch'))
}

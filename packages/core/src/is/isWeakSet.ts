import { rawType } from './rawType'

/**
 * 判断值是否为 `WeakSet`。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是 `WeakSet` 时返回 `true`。
 */
export function isWeakSet<T extends object = any>(target: unknown): target is WeakSet<T> {
  return rawType(target) === 'WeakSet'
}

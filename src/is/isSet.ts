import { rawType } from './rawType'

/**
 * 判断值是否为 `Set`。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是 `Set` 时返回 `true`。
 */
export function isSet<T = unknown>(target: unknown): target is Set<T> {
  return rawType(target) === 'Set'
}

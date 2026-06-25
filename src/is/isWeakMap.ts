import { rawType } from './rawType'

/**
 * 判断值是否为 `WeakMap`。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是 `WeakMap` 时返回 `true`。
 */
export function isWeakMap<K extends WeakKey = WeakKey, V = unknown>(
  target: unknown,
): target is WeakMap<K, V> {
  return rawType(target) === 'WeakMap'
}

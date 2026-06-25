import type { RefObject } from 'react'

/**
 * 判断值是否为 React 对象 ref。
 *
 * 该检查是结构化的，会接受 `current` 值为 `null` 或 `undefined` 的 ref。
 *
 * @param target 需要检查的值。
 * @returns 当值具有 `current` 属性时返回 `true`。
 */
export function isRef<T>(target: unknown): target is RefObject<T> {
  return typeof target === 'object' && target !== null && 'current' in target
}

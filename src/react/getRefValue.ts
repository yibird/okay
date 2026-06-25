import type { RefObject } from 'react'
import { isRef } from './isRef'

/**
 * 获取 React 对象 ref 的当前值，或直接返回原始值。
 *
 * 当传入值是 `{ current }` 形式的对象 ref 时返回 `current`；否则认为传入值已经是目标值，
 * 并原样返回。该方法适合编写既接受 ref 又接受直接值的工具函数。
 *
 * @param value 原始值或 React 对象 ref。
 * @returns ref 的 `current` 值，或原始值本身。
 */
export function getRefValue<T>(value: RefObject<T | null>): T | null
export function getRefValue<T>(value: T): T
export function getRefValue<T>(value: T | RefObject<T | null>): T | null {
  return isRef<T | null>(value) ? value.current : value
}

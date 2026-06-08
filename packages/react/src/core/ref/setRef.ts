import type { Ref } from 'react'

export type RefCleanup = () => void

/**
 * 向 React ref 写入值。
 *
 * 同时支持 callback ref 和可变对象 ref；传入 `null` 或 `undefined` 时会被安全忽略。
 * 该方法常用于封装组件时把 DOM 节点或组件实例同步写入外部 ref。
 *
 * @param ref 需要写入的 React ref。
 * @param value 写入 ref 的值，通常是 DOM 节点、组件实例或 `null`。
 */
export function setRef<T>(ref: Ref<T> | undefined | null, value: T | null): RefCleanup | void {
  if (!ref) return

  if (typeof ref === 'function') {
    const cleanup = ref(value)
    return typeof cleanup === 'function' ? cleanup : undefined
  }

  ref.current = value
  if (value !== null) {
    return () => {
      ref.current = null
    }
  }
}

import type { Ref, RefCallback } from 'react'
import { setRef, type RefCleanup } from './setRef'

/**
 * 将多个 React ref 合成为一个 callback ref。
 *
 * 当组件既要维护内部 ref，又要把同一个 DOM 节点或实例转发给外部调用方时，
 * 可以使用该方法把多个 ref 写入动作合并成一次 callback ref 调用。
 *
 * @param refs 对象 ref、callback ref、null 或 undefined。
 * @returns 会把同一个值写入所有有效 ref 的 callback ref。
 */
export function composeRefs<T>(...refs: Array<Ref<T> | undefined | null>): RefCallback<T> {
  return (value) => {
    const cleanups: RefCleanup[] = []

    for (const ref of refs) {
      const cleanup = setRef(ref, value)
      if (cleanup) {
        cleanups.push(cleanup)
      }
    }

    if (cleanups.length === 0) {
      return
    }

    return () => {
      for (let index = cleanups.length - 1; index >= 0; index--) {
        cleanups[index]()
      }
    }
  }
}

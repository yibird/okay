import { fillRef } from './fill-ref'
import type React from 'react'

/**
 * 组合多个ref
 *
 * @param refs ref数组
 * @returns 返回一个函数,该函数接收一个节点值,并将节点值填充到所有ref中
 */
export function composeRef<T>(...refs: React.Ref<T>[]): React.Ref<T> {
  const validRefs = refs.filter((ref): ref is React.Ref<T> => Boolean(ref))
  if (validRefs.length <= 1) {
    // 如果只有一个有效的Ref或没有，直接返回它
    return validRefs[0] || ((() => {}) as React.Ref<T>)
  }
  return (node: T) => {
    validRefs.forEach((ref) => {
      fillRef(ref, node)
    })
  }
}

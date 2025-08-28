import type React from 'react'

/**
 * 填充ref
 *
 * @param ref 需要填充ref
 * @param node 填充ref的值
 */
export function fillRef<T>(ref: React.Ref<T>, node: T) {
  if (typeof ref === 'function') {
    ref(node)
  } else if (typeof ref === 'object' && ref && 'current' in ref) {
    ;(ref as React.MutableRefObject<T>).current = node
  }
}

import type React from 'react'

export function isRef<T>(target: unknown): target is React.RefObject<T> {
  return (
    typeof target === 'object' &&
    target !== null &&
    'current' in target &&
    target.current !== undefined
  )
}

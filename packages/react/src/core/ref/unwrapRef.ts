import React from 'react'
/**
 * unwrapRef 解包ref值
 * @param value 目标值
 * @returns 解包后的值
 */
export function unwrapRef<T>(value: T | React.RefObject<T>): T {
  if (typeof value === 'object' && value !== null && 'current' in value) {
    return (value as React.RefObject<T>).current as T
  }
  return value as T
}

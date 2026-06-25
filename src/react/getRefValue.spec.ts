import { describe, expect, it } from 'vitest'
import { getRefValue } from './getRefValue'
import type { RefObject } from 'react'

describe('getRefValue', () => {
  it('should unwrap object ref current values', () => {
    const ref: RefObject<number> = { current: 42 }

    expect(getRefValue(ref)).toBe(42)
  })

  it('should preserve null current values', () => {
    const ref: RefObject<HTMLDivElement | null> = { current: null }

    expect(getRefValue(ref)).toBeNull()
  })

  it('should return direct values unchanged', () => {
    const value = { id: 1 }

    expect(getRefValue(value)).toBe(value)
  })
})

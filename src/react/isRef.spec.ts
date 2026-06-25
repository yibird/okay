import { describe, expect, it } from 'vitest'
import { isRef } from './isRef'

describe('isRef', () => {
  it('should recognize object refs with null or undefined current values', () => {
    expect(isRef({ current: null })).toBe(true)
    expect(isRef({ current: undefined })).toBe(true)
  })

  it('should reject non-ref values', () => {
    expect(isRef(null)).toBe(false)
    expect(isRef(undefined)).toBe(false)
    expect(isRef({})).toBe(false)
    expect(isRef(() => null)).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import { formatBytes } from './formatBytes'

describe('formatBytes', () => {
  it('should format bytes', () => {
    expect(formatBytes(512)).toBe('512 B')
  })

  it('should format binary units by default', () => {
    expect(formatBytes(1536)).toBe('1.5 KiB')
  })

  it('should format decimal units', () => {
    expect(formatBytes(1500, { base: 1000 })).toBe('1.5 KB')
  })

  it('should support decimals and negative values', () => {
    expect(formatBytes(-1536, { decimals: 0 })).toBe('-2 KiB')
  })

  it('should reject invalid sizes', () => {
    expect(() => formatBytes(Number.POSITIVE_INFINITY)).toThrow(TypeError)
  })
})

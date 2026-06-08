import { describe, expect, it } from 'vitest'
import { readBuffer } from './readBuffer'

describe('readBuffer', () => {
  it('should read blob as array buffer via native arrayBuffer()', async () => {
    const result = await readBuffer(new Blob(['okay']))
    expect(new TextDecoder().decode(result)).toBe('okay')
  })

  it('falls back to FileReader when arrayBuffer is unavailable', async () => {
    const blob = new Blob(['fallback'])
    const original = Object.getOwnPropertyDescriptor(Blob.prototype, 'arrayBuffer')
    Object.defineProperty(blob, 'arrayBuffer', { value: undefined, configurable: true })
    try {
      const result = await readBuffer(blob)
      expect(new TextDecoder().decode(result)).toBe('fallback')
    } finally {
      if (original) Object.defineProperty(Blob.prototype, 'arrayBuffer', original)
    }
  })
})

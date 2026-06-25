import { describe, expect, it } from 'vitest'
import { blobBase64 } from './blobBase64'

describe('blobBase64', () => {
  it('should convert blob to base64 without Buffer', async () => {
    await expect(blobBase64(new Blob(['okay']))).resolves.toBe('b2theQ==')
  })

  it('should encode large blobs in chunks', async () => {
    const bytes = new Uint8Array(7000).fill(65)

    await expect(blobBase64(new Blob([bytes]))).resolves.toBe(btoa(String.fromCharCode(...bytes)))
  })

  it('should encode empty blobs to an empty string', async () => {
    await expect(blobBase64(new Blob([]))).resolves.toBe('')
  })
})

import { describe, expect, it } from 'vitest'
import { blobText } from './blobText'

describe('blobText', () => {
  it('should convert blob to text', async () => {
    await expect(blobText(new Blob(['okay']))).resolves.toBe('okay')
  })
})

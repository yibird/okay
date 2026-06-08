import { afterEach, describe, expect, it, vi } from 'vitest'
import { dataUrl } from './dataUrl'

describe('dataUrl', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should convert blob to data URL', async () => {
    const result = await dataUrl(new Blob(['okay'], { type: 'text/plain' }))

    expect(result).toBe('data:text/plain;base64,b2theQ==')
  })

  it('should fallback when FileReader is unavailable', async () => {
    vi.stubGlobal('FileReader', undefined)

    await expect(dataUrl(new Blob(['okay'], { type: 'text/plain' }))).resolves.toBe(
      'data:text/plain;base64,b2theQ==',
    )
  })

  it('should use octet-stream fallback when blob type is empty', async () => {
    vi.stubGlobal('FileReader', undefined)

    await expect(dataUrl(new Blob(['okay']))).resolves.toBe(
      'data:application/octet-stream;base64,b2theQ==',
    )
  })
})

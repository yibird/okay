import { describe, expect, it } from 'vitest'
import { readJson } from './readJson'

describe('readJson', () => {
  it('should read blob as JSON', async () => {
    await expect(readJson<{ name: string }>(new Blob(['{"name":"okay"}']))).resolves.toEqual({
      name: 'okay',
    })
  })

  it('should return fallback for invalid JSON', async () => {
    await expect(readJson(new Blob(['invalid']), { name: 'fallback' })).resolves.toEqual({
      name: 'fallback',
    })
  })

  it('should reject invalid JSON without fallback', async () => {
    await expect(readJson(new Blob(['invalid']))).rejects.toThrow('Failed to parse blob as JSON.')
  })
})

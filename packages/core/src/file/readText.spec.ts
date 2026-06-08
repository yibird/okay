import { describe, expect, it } from 'vitest'
import { readText } from './readText'

describe('readText', () => {
  it('reads via blob.text() by default', async () => {
    await expect(readText(new Blob(['okay']))).resolves.toBe('okay')
  })

  it('falls back to FileReader when encoding is specified', async () => {
    await expect(readText(new Blob(['hello']), { encoding: 'utf-8' })).resolves.toBe('hello')
  })
})

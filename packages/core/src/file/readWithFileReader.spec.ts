import { describe, expect, it } from 'vitest'
import { readWithFileReader } from './readWithFileReader'

describe('readWithFileReader', () => {
  it('rejects when FileReader is unavailable', async () => {
    const original = globalThis.FileReader
    // @ts-expect-error intentional
    delete globalThis.FileReader
    try {
      await expect(readWithFileReader(new Blob(['x']), 'readAsArrayBuffer')).rejects.toThrow(
        'FileReader is not available',
      )
    } finally {
      globalThis.FileReader = original
    }
  })

  it('reads as ArrayBuffer via FileReader', async () => {
    const result = await readWithFileReader<ArrayBuffer>(new Blob(['hello']), 'readAsArrayBuffer')
    expect(new TextDecoder().decode(result)).toBe('hello')
  })

  it('reads as DataURL via FileReader', async () => {
    const result = await readWithFileReader<string>(
      new Blob(['hi'], { type: 'text/plain' }),
      'readAsDataURL',
    )
    expect(result).toMatch(/^data:text\/plain/)
  })

  it('reads as text with encoding via FileReader', async () => {
    const result = await readWithFileReader<string>(new Blob(['ok']), 'readAsText', 'utf-8')
    expect(result).toBe('ok')
  })

  it('rejects on FileReader error', async () => {
    const OriginalFileReader = globalThis.FileReader
    class ErrorFileReader extends OriginalFileReader {
      readAsArrayBuffer() {
        // Synchronously dispatch error
        setTimeout(() => {
          const ev = new ProgressEvent('error')
          this.dispatchEvent(ev)
        }, 0)
      }
    }
    globalThis.FileReader = ErrorFileReader
    try {
      await expect(readWithFileReader(new Blob(['x']), 'readAsArrayBuffer')).rejects.toBeDefined()
    } finally {
      globalThis.FileReader = OriginalFileReader
    }
  })

  it('rejects on FileReader abort', async () => {
    const OriginalFileReader = globalThis.FileReader
    class AbortFileReader extends OriginalFileReader {
      readAsArrayBuffer() {
        setTimeout(() => {
          const ev = new ProgressEvent('abort')
          this.dispatchEvent(ev)
        }, 0)
      }
    }
    globalThis.FileReader = AbortFileReader
    try {
      await expect(readWithFileReader(new Blob(['x']), 'readAsArrayBuffer')).rejects.toThrow(
        'aborted',
      )
    } finally {
      globalThis.FileReader = OriginalFileReader
    }
  })

  it('rejects when FileReader read method throws synchronously', async () => {
    const OriginalFileReader = globalThis.FileReader
    class ThrowingFileReader extends OriginalFileReader {
      readAsArrayBuffer() {
        throw new Error('sync read failure')
      }
    }
    globalThis.FileReader = ThrowingFileReader
    try {
      await expect(readWithFileReader(new Blob(['x']), 'readAsArrayBuffer')).rejects.toThrow(
        'sync read failure',
      )
    } finally {
      globalThis.FileReader = OriginalFileReader
    }
  })
})

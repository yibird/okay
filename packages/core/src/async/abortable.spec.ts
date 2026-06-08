import { describe, expect, it } from 'vitest'
import { abortable } from './abortable'

describe('abortable', () => {
  it('should resolve when original promise resolves', async () => {
    const originalPromise = Promise.resolve('success')
    const { promise } = abortable(originalPromise)
    await expect(promise).resolves.toBe('success')
  })

  it('should reject when original promise rejects', async () => {
    const originalPromise = Promise.reject(new Error('failure'))
    const { promise } = abortable(originalPromise)
    await expect(promise).rejects.toThrow('failure')
  })

  it('should reject with abort error when aborted', async () => {
    const originalPromise = new Promise(() => {})
    const { promise, abort } = abortable(originalPromise)
    abort()
    await expect(promise).rejects.toThrow('Promise aborted')
  })

  it('should reject with custom abort reason', async () => {
    const error = new Error('custom abort')
    const { promise, abort } = abortable(new Promise(() => {}))
    abort(error)
    await expect(promise).rejects.toBe(error)
  })

  it('should ignore abort after the promise settles', async () => {
    const { promise, abort } = abortable(Promise.resolve('success'))
    await expect(promise).resolves.toBe('success')
    abort()
    await expect(promise).resolves.toBe('success')
  })

  it('should ignore resolve after abort', async () => {
    let resolveOuter!: (v: string) => void
    const outer = new Promise<string>((r) => {
      resolveOuter = r
    })
    const { promise, abort } = abortable(outer)
    abort()
    resolveOuter('late')
    await expect(promise).rejects.toThrow()
  })
})

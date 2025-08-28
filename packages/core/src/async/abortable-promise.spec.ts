import { describe, expect, it } from 'vitest'
import { abortablePromise } from './abortable-promise'

describe('abortablePromise', () => {
  it('should resolve when original promise resolves', async () => {
    const originalPromise = Promise.resolve('success')
    const { promise } = abortablePromise(originalPromise)
    await expect(promise).resolves.toBe('success')
  })

  it('should reject when original promise rejects', async () => {
    const originalPromise = Promise.reject(new Error('failure'))
    const { promise } = abortablePromise(originalPromise)
    await expect(promise).rejects.toThrow('failure')
  })

  it('should reject with abort error when aborted', async () => {
    const originalPromise = new Promise(() => {})
    const { promise, abort } = abortablePromise(originalPromise)
    abort()
    await expect(promise).rejects.toThrow('Promise aborted')
  })
})

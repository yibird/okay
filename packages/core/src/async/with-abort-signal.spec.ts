import { describe, expect, it } from 'vitest'
import { withAbortSignal } from './with-abort-signal'

describe('withAbortSignal', () => {
  it('should resolve when original promise resolves and signal is not aborted', async () => {
    const originalPromise = Promise.resolve('success')
    await expect(withAbortSignal(originalPromise)).resolves.toBe('success')
  })

  it('should reject when original promise rejects and signal is not aborted', async () => {
    const originalPromise = Promise.reject(new Error('failure'))
    await expect(withAbortSignal(originalPromise)).rejects.toThrow('failure')
  })

  it('should reject immediately when signal is already aborted', async () => {
    const controller = new AbortController()
    controller.abort()
    const originalPromise = Promise.resolve('success')
    await expect(
      withAbortSignal(originalPromise, controller.signal),
    ).rejects.toThrow('Aborted')
  })

  it('should reject when signal is aborted during promise execution', async () => {
    const controller = new AbortController()
    const originalPromise = new Promise((resolve) => {
      setTimeout(() => resolve('success'), 100)
    })
    const wrappedPromise = withAbortSignal(originalPromise, controller.signal)
    // 立即中止信号
    controller.abort()
    await expect(wrappedPromise).rejects.toThrow('Aborted')
  })

  it('should not throw error when signal is undefined', async () => {
    const originalPromise = Promise.resolve('success')
    await expect(withAbortSignal(originalPromise)).resolves.toBe('success')
  })
})

import { describe, expect, it, vi } from 'vitest'
import { promiseWithTimeout } from './promise-with-timeout'

describe('promiseWithTimeout', () => {
  it('should resolve when promise resolves before timeout', async () => {
    const promise = Promise.resolve('success')
    await expect(promiseWithTimeout(promise, 1000)).resolves.toBe('success')
  })

  it('should reject when promise rejects before timeout', async () => {
    const promise = Promise.reject(new Error('failure'))
    await expect(promiseWithTimeout(promise, 1000)).rejects.toThrow('failure')
  })

  it('should reject with timeout error when promise takes too long', async () => {
    const promise = new Promise((resolve) => setTimeout(resolve, 200))
    await expect(promiseWithTimeout(promise, 100)).rejects.toThrow(
      'Promise timeout',
    )
  })

  it('should use custom timeout error message', async () => {
    const promise = new Promise((resolve) => setTimeout(resolve, 200))
    const customError = new Error('Custom timeout')
    await expect(promiseWithTimeout(promise, 100, customError)).rejects.toThrow(
      'Custom timeout',
    )
  })

  it('should clear timeout after promise resolves', async () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
    const promise = Promise.resolve('success')
    await promiseWithTimeout(promise, 1000)
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('should clear timeout after promise rejects', async () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
    const promise = Promise.reject(new Error('failure'))
    try {
      await promiseWithTimeout(promise, 1000)
    } catch {}
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})

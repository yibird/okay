import { describe, expect, it, vi } from 'vitest'
import { retryPromise } from './retry-promise'

describe('retryPromise', () => {
  it('should resolve on first attempt when successful', async () => {
    const func = vi.fn(() => Promise.resolve('success'))
    const result = await retryPromise(func)
    expect(result).toBe('success')
    expect(func).toHaveBeenCalledTimes(1)
  })

  it('should retry and resolve after failures', async () => {
    let attempts = 0
    const func = vi.fn(() => {
      attempts++
      return attempts < 3
        ? Promise.reject(new Error('failure'))
        : Promise.resolve('success')
    })
    const result = await retryPromise(func, 3, 10)
    expect(result).toBe('success')
    expect(func).toHaveBeenCalledTimes(3)
  })

  it('should throw after max retries', async () => {
    const func = vi.fn(() => Promise.reject(new Error('failure')))
    await expect(retryPromise(func, 2, 10)).rejects.toThrow('failure')
    expect(func).toHaveBeenCalledTimes(3) // 1 initial + 2 retries
  })

  it('should respect custom retry condition', async () => {
    const func = vi.fn(() => Promise.reject(new Error('skip retry')))
    const shouldRetry = (error: Error) => error.message !== 'skip retry'
    await expect(retryPromise(func, 3, 10, shouldRetry)).rejects.toThrow(
      'skip retry',
    )
    expect(func).toHaveBeenCalledTimes(1)
  })

  it('should wait for delay between retries', async () => {
    let attempts = 0
    const func = vi.fn(() => {
      attempts++
      return attempts < 2
        ? Promise.reject(new Error('failure'))
        : Promise.resolve('success')
    })
    const start = Date.now()
    await retryPromise(func, 1, 100)
    const duration = Date.now() - start
    expect(duration).toBeGreaterThanOrEqual(100)
  })
})

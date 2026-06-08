import { describe, expect, it, vi } from 'vitest'
import { retry } from './retry'

describe('retry', () => {
  it('should resolve on first attempt when successful', async () => {
    const func = vi.fn(() => Promise.resolve('success'))
    const result = await retry(func)
    expect(result).toBe('success')
    expect(func).toHaveBeenCalledTimes(1)
  })

  it('should retry and resolve after failures', async () => {
    let attempts = 0
    const func = vi.fn(() => {
      attempts++
      return attempts < 3 ? Promise.reject(new Error('failure')) : Promise.resolve('success')
    })
    const result = await retry(func, 3, 10)
    expect(result).toBe('success')
    expect(func).toHaveBeenCalledTimes(3)
  })

  it('should throw after max retries', async () => {
    const func = vi.fn(() => Promise.reject(new Error('failure')))
    await expect(retry(func, 2, 10)).rejects.toThrow('failure')
    expect(func).toHaveBeenCalledTimes(3) // 1 initial + 2 retries
  })

  it('should respect custom retry condition', async () => {
    const func = vi.fn(() => Promise.reject(new Error('skip retry')))
    const shouldRetry = (error: Error) => error.message !== 'skip retry'
    await expect(retry(func, 3, 10, shouldRetry)).rejects.toThrow('skip retry')
    expect(func).toHaveBeenCalledTimes(1)
  })

  it('should pass attempt number to retry condition', async () => {
    const func = vi.fn(() => Promise.reject(new Error('failure')))
    const shouldRetry = vi.fn(() => false)

    await expect(retry(func, 3, 0, shouldRetry)).rejects.toThrow('failure')

    expect(shouldRetry).toHaveBeenCalledWith(expect.any(Error), 1)
  })

  it('should wait for delay between retries', async () => {
    let attempts = 0
    const func = vi.fn(() => {
      attempts++
      return attempts < 2 ? Promise.reject(new Error('failure')) : Promise.resolve('success')
    })
    const start = Date.now()
    await retry(func, 1, 100)
    const duration = Date.now() - start
    expect(duration).toBeGreaterThanOrEqual(100)
  })

  it('should support function delay', async () => {
    let attempts = 0
    const delay = vi.fn(() => 0)
    const func = vi.fn(() => {
      attempts++
      return attempts < 2 ? Promise.reject(new Error('failure')) : Promise.resolve('success')
    })

    await expect(retry(func, 1, delay)).resolves.toBe('success')

    expect(delay).toHaveBeenCalledWith(1)
  })
})

import { describe, expect, it, vi } from 'vitest'
import { singleFlight } from './single-flight'

describe('singleFlight', () => {
  it('should execute the function only once when called multiple times', async () => {
    const func = vi.fn(() => Promise.resolve('result'))
    const wrapped = singleFlight(func)

    const promises = [wrapped(), wrapped(), wrapped()]
    const results = await Promise.all(promises)

    expect(func).toHaveBeenCalledTimes(1)
    expect(results).toEqual(['result', 'result', 'result'])
  })

  it('should allow new execution after the first one completes', async () => {
    const func = vi.fn(() => Promise.resolve('result'))
    const wrapped = singleFlight(func)

    await wrapped()
    await wrapped()

    expect(func).toHaveBeenCalledTimes(2)
  })

  it('should handle function arguments correctly', async () => {
    const func = vi.fn((a: number, b: number) => Promise.resolve(a + b))
    const wrapped = singleFlight(func)

    const result = await wrapped(2, 3)

    expect(func).toHaveBeenCalledWith(2, 3)
    expect(result).toBe(5)
  })

  it('should propagate errors to all callers', async () => {
    const error = new Error('failure')
    const func = vi.fn(() => Promise.reject(error))
    const wrapped = singleFlight(func)

    const promises = [wrapped(), wrapped(), wrapped()]

    await expect(Promise.all(promises)).rejects.toThrow('failure')
    expect(func).toHaveBeenCalledTimes(1)
  })

  it('should reset pending promise after rejection', async () => {
    let attempts = 0
    const func = vi.fn(() => {
      attempts++
      return attempts === 1
        ? Promise.reject(new Error('failure'))
        : Promise.resolve('success')
    })
    const wrapped = singleFlight(func)

    try {
      await wrapped()
    } catch {}

    const result = await wrapped()

    expect(attempts).toBe(2)
    expect(result).toBe('success')
  })
})

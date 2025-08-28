import { describe, expect, it, vi } from 'vitest'
import { asyncTo } from './async-to'

describe('asyncTo', () => {
  it('should return [null, result] when promise resolves', async () => {
    const result = await asyncTo(Promise.resolve('success'))
    expect(result).toEqual([null, 'success'])
  })

  it('should return [error, null] when promise rejects', async () => {
    const error = new Error('failure')
    const result = await asyncTo(Promise.reject(error))
    expect(result[0]).toBe(error)
    expect(result[1]).toBeNull()
  })

  it('should call callback function on finally', async () => {
    const callback = vi.fn()
    await asyncTo(Promise.resolve('success'), callback)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should handle different error types', async () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message)
        this.name = message
      }
    }
    const error = new CustomError('custom error')
    const result = await asyncTo<unknown, CustomError>(Promise.reject(error))
    expect(result[0]).toBeInstanceOf(CustomError)
    expect(result[0]?.message).toBe('custom error')
    expect(result[1]).toBeNull()
  })
})

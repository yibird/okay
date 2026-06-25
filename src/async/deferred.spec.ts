import { describe, expect, it } from 'vitest'
import { deferred } from './deferred'

describe('deferred', () => {
  it('should resolve the exposed promise', async () => {
    const task = deferred<number>()

    task.resolve(1)

    await expect(task.promise).resolves.toBe(1)
  })

  it('should reject the exposed promise', async () => {
    const task = deferred<number, Error>()
    const error = new Error('failed')

    task.reject(error)

    await expect(task.promise).rejects.toBe(error)
  })

  it('should resolve with a promise-like value', async () => {
    const task = deferred<number>()

    task.resolve(Promise.resolve(2))

    await expect(task.promise).resolves.toBe(2)
  })
})

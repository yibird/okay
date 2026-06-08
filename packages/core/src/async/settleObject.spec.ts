import { describe, expect, it } from 'vitest'
import { settleObject } from './settleObject'

describe('settleObject', () => {
  it('should settle object-shaped promises and preserve keys', async () => {
    const error = new Error('failed')
    const result = await settleObject({
      a: Promise.resolve(1),
      b: 'okay',
      c: Promise.reject(error),
    })

    expect(result.a).toEqual({ status: 'fulfilled', value: 1 })
    expect(result.b).toEqual({ status: 'fulfilled', value: 'okay' })
    expect(result.c).toEqual({ status: 'rejected', reason: error })
  })

  it('should handle empty objects', async () => {
    await expect(settleObject({})).resolves.toEqual({})
  })
})

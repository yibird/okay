import { describe, expect, it } from 'vitest'
import { raceObject } from './raceObject'

describe('raceObject', () => {
  it('返回最先完成的属性键和值', async () => {
    await expect(
      raceObject({
        fast: Promise.resolve('ok'),
        slow: new Promise((resolve) => setTimeout(() => resolve('later'), 10)),
      }),
    ).resolves.toEqual({
      key: 'fast',
      value: 'ok',
    })
  })

  it('保留 symbol 属性键', async () => {
    const key = Symbol('task')

    await expect(
      raceObject({
        [key]: Promise.resolve(1),
      }),
    ).resolves.toEqual({
      key,
      value: 1,
    })
  })
})

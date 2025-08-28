// test/parallelTasks.spec.ts
import { describe, expect, it } from 'vitest'
import { parallelTasks } from './parallel-tasks'

describe('parallelTasks', () => {
  it('should execute all tasks and return results in order', async () => {
    const task1 = () => Promise.resolve(1)
    const task2 = () => Promise.resolve(2)
    const task3 = () => Promise.resolve(3)
    const results = await parallelTasks([task1, task2, task3], 2)
    expect(results).toEqual([1, 2, 3])
  })

  it('should respect concurrency limit', async () => {
    const delay = (ms: number, value: number) =>
      new Promise<number>((resolve) => setTimeout(() => resolve(value), ms))
    const task1 = () => delay(100, 1)
    const task2 = () => delay(100, 2)
    const task3 = () => delay(100, 3)

    const start = Date.now()
    await parallelTasks([task1, task2, task3], 2)
    const duration = Date.now() - start

    // 应该大约在200ms左右完成（2批，每批100ms）
    expect(duration).toBeGreaterThanOrEqual(190)
    expect(duration).toBeLessThan(250)
  })

  it('should handle task rejections', async () => {
    const task1 = () => Promise.resolve(1)
    const task2 = () => Promise.reject(new Error('task failed'))
    const task3 = () => Promise.resolve(3)

    await expect(parallelTasks([task1, task2, task3], 2)).rejects.toThrow(
      'task failed',
    )
  })

  it('should return empty array when tasks array is empty', async () => {
    const results = await parallelTasks([], 2)
    expect(results).toEqual([])
  })

  it('should execute tasks sequentially when concurrency is 1', async () => {
    const delay = (ms: number, value: number) =>
      new Promise<number>((resolve) => setTimeout(() => resolve(value), ms))
    const task1 = () => delay(100, 1)
    const task2 = () => delay(100, 2)
    const task3 = () => delay(100, 3)

    const start = Date.now()
    await parallelTasks([task1, task2, task3], 1)
    const duration = Date.now() - start

    // 应该大约在300ms左右完成（3个串行任务，每个100ms）
    expect(duration).toBeGreaterThanOrEqual(290)
    expect(duration).toBeLessThan(350)
  })
})

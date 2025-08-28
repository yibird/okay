import { describe, expect, test, vi } from 'vitest'
import { AsyncQueue } from './async-queue'

describe('AsyncQueue', () => {
  test('should enqueue and process tasks in order', async () => {
    const queue = new AsyncQueue<number>()
    const mockTask1 = vi.fn().mockResolvedValue(1)
    const mockTask2 = vi.fn().mockResolvedValue(2)

    // @ts-ignore: 访问私有方法
    const promise1 = queue.enqueue(mockTask1)
    // @ts-ignore: 访问私有方法
    const promise2 = queue.enqueue(mockTask2)

    const results = await Promise.all([promise1, promise2])

    expect(results).toEqual([1, 2])
    expect(mockTask1).toHaveBeenCalledBefore(mockTask2)
  })

  test('should handle task errors', async () => {
    const queue = new AsyncQueue<number>()
    const error = new Error('Task failed')
    const mockTask = vi.fn().mockRejectedValue(error)

    // @ts-ignore: 访问私有方法
    await expect(queue.enqueue(mockTask)).rejects.toThrow(error)
    expect(mockTask).toHaveBeenCalled()
  })

  test('should process tasks sequentially', async () => {
    const queue = new AsyncQueue<number>()
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms))
    const startTime = Date.now()

    // @ts-ignore: 访问私有方法
    queue.enqueue(() => delay(100).then(() => 1))
    // @ts-ignore: 访问私有方法
    queue.enqueue(() => delay(100).then(() => 2))
    // @ts-ignore: 访问私有方法
    const result = await queue.enqueue(() => delay(100).then(() => 3))

    const endTime = Date.now()
    expect(result).toBe(3)
    expect(endTime - startTime).toBeGreaterThanOrEqual(300)
  })

  test('should not process when queue is empty', () => {
    const queue = new AsyncQueue<number>()
    // @ts-ignore: 访问私有属性
    expect(queue.queue).toHaveLength(0)
    // @ts-ignore: 访问私有属性
    expect(queue.isProcessing).toBe(false)
  })
})

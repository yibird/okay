import { describe, expect, it, vi } from 'vitest'
import { timeSlice } from './timeSlice'

describe('timeSlice', () => {
  it('分片执行生成器任务并返回最终结果', async () => {
    const values: number[] = []
    const result = await timeSlice(function* () {
      for (let i = 0; i < 5; i++) {
        values.push(i)
        yield
      }
      return values.length
    })
    expect(result).toBe(5)
    expect(values).toEqual([0, 1, 2, 3, 4])
  })

  it('生成器运行时抛出错误会拒绝 Promise', async () => {
    const error = new Error('failed')
    await expect(
      timeSlice(function* () {
        yield
        throw error
      }),
    ).rejects.toBe(error)
  })

  it('generatorFn 自身同步抛出会拒绝 Promise', async () => {
    const error = new Error('gen init error')
    await expect(
      timeSlice(() => {
        throw error
      }),
    ).rejects.toBe(error)
  })

  it('校验非法时间片预算', () => {
    expect(() => timeSlice(function* () {}, 0)).toThrow(TypeError)
    expect(() => timeSlice(function* () {}, -1)).toThrow(TypeError)
  })

  it('优先使用 requestIdleCallback 调度', async () => {
    const orig = globalThis.requestIdleCallback
    const ric = vi.fn((cb: IdleRequestCallback) => {
      cb({ didTimeout: false, timeRemaining: () => 10 } as IdleDeadline)
      return 1
    })
    globalThis.requestIdleCallback = ric
    try {
      await timeSlice(function* () {
        yield
      })
      expect(ric).toHaveBeenCalled()
    } finally {
      globalThis.requestIdleCallback = orig
    }
  })

  it('MessageChannel 链表多节点入队走 else 路径', async () => {
    const origRic = (globalThis as any).requestIdleCallback
    const origRaf = (globalThis as any).requestAnimationFrame
    delete (globalThis as any).requestIdleCallback
    delete (globalThis as any).requestAnimationFrame
    // 用极短 budget 强制多次调度，让链表入队超过一次
    try {
      const result = await timeSlice(function* () {
        yield
        yield
        yield
        return 'done'
      }, 0.001)
      expect(result).toBe('done')
    } finally {
      if (origRic) globalThis.requestIdleCallback = origRic
      if (origRaf) globalThis.requestAnimationFrame = origRaf
    }
  })

  it('并发 timeSlice 任务会覆盖 MessageChannel 多节点队列', async () => {
    const origRic = (globalThis as any).requestIdleCallback
    const origRaf = (globalThis as any).requestAnimationFrame
    delete (globalThis as any).requestIdleCallback
    delete (globalThis as any).requestAnimationFrame

    try {
      const first = timeSlice(function* () {
        yield
        return 1
      })
      const second = timeSlice(function* () {
        yield
        return 2
      })

      await expect(Promise.all([first, second])).resolves.toEqual([1, 2])
    } finally {
      if (origRic) globalThis.requestIdleCallback = origRic
      if (origRaf) globalThis.requestAnimationFrame = origRaf
    }
  })

  it('无 requestIdleCallback 时使用 requestAnimationFrame + MessageChannel', async () => {
    const origRic = (globalThis as any).requestIdleCallback
    delete (globalThis as any).requestIdleCallback
    const origRaf = (globalThis as any).requestAnimationFrame
    const raf = vi.fn((cb: FrameRequestCallback) => {
      cb(0)
      return 1
    })
    globalThis.requestAnimationFrame = raf
    try {
      await timeSlice(function* () {
        yield
      })
      expect(raf).toHaveBeenCalled()
    } finally {
      if (origRic) globalThis.requestIdleCallback = origRic
      globalThis.requestAnimationFrame = origRaf
    }
  })

  it('缺少 performance 和 MessageChannel 时回退到 Date.now 与 setTimeout', async () => {
    const originalRic = (globalThis as any).requestIdleCallback
    const originalRaf = (globalThis as any).requestAnimationFrame
    const originalMessageChannel = globalThis.MessageChannel
    const originalPerformance = globalThis.performance

    delete (globalThis as any).requestIdleCallback
    delete (globalThis as any).requestAnimationFrame
    vi.stubGlobal('MessageChannel', undefined)
    vi.stubGlobal('performance', undefined)
    vi.resetModules()

    try {
      // @ts-expect-error Vite query 用于强制加载一份新的模块实例，覆盖模块初始化 fallback。
      const mod = await import('./timeSlice?fallback')
      await expect(
        mod.timeSlice(function* () {
          yield
          return 'done'
        }, 1),
      ).resolves.toBe('done')
    } finally {
      if (originalRic) globalThis.requestIdleCallback = originalRic
      if (originalRaf) globalThis.requestAnimationFrame = originalRaf
      vi.stubGlobal('MessageChannel', originalMessageChannel)
      vi.stubGlobal('performance', originalPerformance)
      vi.resetModules()
    }
  })
})

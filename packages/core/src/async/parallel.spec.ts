import { describe, expect, it, vi } from 'vitest'
import { parallel } from './parallel'

describe('parallel', () => {
  it('should execute all tasks and return results in order', async () => {
    await expect(
      parallel([() => Promise.resolve(1), () => Promise.resolve(2)], 2),
    ).resolves.toEqual([1, 2])
  })

  it('should respect concurrency limit', async () => {
    let running = 0,
      maxRunning = 0
    const t = (v: number) => async () => {
      running++
      maxRunning = Math.max(maxRunning, running)
      await Promise.resolve()
      running--
      return v
    }
    await parallel([t(1), t(2), t(3)], 2)
    expect(maxRunning).toBe(2)
  })

  it('should handle task rejections', async () => {
    await expect(
      parallel([() => Promise.resolve(1), () => Promise.reject(new Error('fail'))], 2),
    ).rejects.toThrow('fail')
  })

  it('should stop scheduling after rejection', async () => {
    const t2 = vi.fn(() => Promise.resolve(2))
    await expect(parallel([() => Promise.reject(new Error('fail')), t2], 1)).rejects.toThrow('fail')
    expect(t2).not.toHaveBeenCalled()
  })

  it('should return empty array for empty tasks', async () => {
    await expect(parallel([], 2)).resolves.toEqual([])
  })

  it('throws for non-array tasks', () => {
    expect(() => parallel(null as any)).toThrow(TypeError)
  })

  it('aborts with already-aborted signal', async () => {
    const c = new AbortController()
    c.abort(new Error('pre-aborted'))
    await expect(parallel([() => Promise.resolve(1)], 1, { signal: c.signal })).rejects.toThrow(
      'pre-aborted',
    )
  })

  it('aborts with default error when already-aborted signal has no reason', async () => {
    const signal = {
      aborted: true,
      reason: undefined,
    } as AbortSignal

    await expect(parallel([() => Promise.resolve(1)], 1, { signal })).rejects.toThrow('Aborted')
  })

  it('aborts mid-flight with signal', async () => {
    const c = new AbortController()
    const slow = () => new Promise<number>((r) => setTimeout(() => r(1), 200))
    const p = parallel([slow, slow], 2, { signal: c.signal })
    c.abort()
    await expect(p).rejects.toBeDefined()
  })

  it('aborts mid-flight with custom reason', async () => {
    const c = new AbortController()
    const slow = () => new Promise<number>((resolve) => setTimeout(() => resolve(1), 200))
    const p = parallel([slow, slow], 2, { signal: c.signal })
    c.abort(new Error('custom abort'))

    await expect(p).rejects.toThrow('custom abort')
  })

  it('aborts mid-flight with default error when signal has no reason', async () => {
    let abort!: () => void
    const signal = {
      aborted: false,
      reason: undefined,
      addEventListener: vi.fn((_event: string, listener: EventListenerOrEventListenerObject) => {
        abort = listener as () => void
      }),
      removeEventListener: vi.fn(),
    } as unknown as AbortSignal
    const p = parallel([() => new Promise<number>(() => {})], 1, { signal })

    abort()

    await expect(p).rejects.toThrow('Aborted')
  })

  it('normalizes invalid concurrency to one worker', async () => {
    const order: number[] = []

    await parallel(
      [
        async () => {
          order.push(1)
          return 1
        },
        async () => {
          order.push(2)
          return 2
        },
      ],
      0,
    )

    expect(order).toEqual([1, 2])
  })
})

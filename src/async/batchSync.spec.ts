import { describe, expect, it, vi } from 'vitest'
import { batchSync } from './batchSync'

const nextMicrotask = () => Promise.resolve()

describe('batchSync', () => {
  it('在同一个微任务批次内去重并只触发一次回调', async () => {
    const callback = vi.fn()
    const sync = batchSync(callback, { key: (item: { id: number }) => item.id })
    sync({ id: 1 })
    sync({ id: 1 })
    sync({ id: 2 })
    await nextMicrotask()
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }])
  })

  it('支持合并和排序批量数据', async () => {
    const callback = vi.fn()
    const sync = batchSync<{ id: number; name: string }>(callback, {
      key: (item) => item.id,
      merge: (prev, next) => ({ ...prev, ...next }),
      sort: (l, r) => r.id - l.id,
    })
    sync.push({ id: 1, name: 'old' }, { id: 2, name: 'two' }, { id: 1, name: 'new' })
    await nextMicrotask()
    expect(callback).toHaveBeenCalledWith([
      { id: 2, name: 'two' },
      { id: 1, name: 'new' },
    ])
  })

  it('支持手动刷新和取消', () => {
    const callback = vi.fn()
    const sync = batchSync(callback)
    sync.flush()
    expect(callback).not.toHaveBeenCalled()
    sync('a')
    expect(sync.size).toBe(1)
    sync.flush()
    expect(callback).toHaveBeenCalledWith(['a'])
    sync('b')
    sync.cancel()
    expect(sync.size).toBe(0)
  })

  it('取消信号触发后不再收集数据', async () => {
    const callback = vi.fn()
    const controller = new AbortController()
    const sync = batchSync(callback, { signal: controller.signal })
    sync('a')
    controller.abort()
    sync('b')
    await nextMicrotask()
    expect(callback).not.toHaveBeenCalled()
    expect(sync.size).toBe(0)
  })

  it('raf 调度器在有 requestAnimationFrame 时使用它', async () => {
    const raf = vi.fn((cb: FrameRequestCallback) => {
      cb(0)
      return 1
    })
    vi.stubGlobal('requestAnimationFrame', raf)
    const callback = vi.fn()
    const sync = batchSync(callback, { scheduler: 'raf' })
    sync('x')
    await new Promise((r) => setTimeout(r, 50))
    expect(raf).toHaveBeenCalled()
    expect(callback).toHaveBeenCalledWith(['x'])
    vi.unstubAllGlobals()
  })

  it('raf 调度器在无 requestAnimationFrame 时回退到 setTimeout', async () => {
    const origRaf = (globalThis as any).requestAnimationFrame
    delete (globalThis as any).requestAnimationFrame
    const callback = vi.fn()
    const sync = batchSync(callback, { scheduler: 'raf' })
    sync('y')
    await new Promise((r) => setTimeout(r, 50))
    expect(callback).toHaveBeenCalledWith(['y'])
    if (origRaf) globalThis.requestAnimationFrame = origRaf
  })

  it('microtask 调度器在无 queueMicrotask 时回退到 setTimeout', async () => {
    const original = globalThis.queueMicrotask
    vi.stubGlobal('queueMicrotask', undefined)
    const callback = vi.fn()
    const sync = batchSync(callback)

    sync('z')
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(callback).toHaveBeenCalledWith(['z'])
    vi.stubGlobal('queueMicrotask', original)
  })

  it('scheduled flush with empty cache sets scheduled to false without calling callback', async () => {
    const callback = vi.fn()
    const sync = batchSync(callback)
    // trigger a scheduled flush but cancel before it runs to leave cache empty
    sync('a')
    sync.cancel() // clears cache and increments version, invalidating scheduled flush
    await new Promise((r) => setTimeout(r, 10))
    expect(callback).not.toHaveBeenCalled()
  })

  it('cancel removes abort listener from signal to prevent memory leaks', () => {
    const callback = vi.fn()
    const addSpy = vi.fn()
    const removeSpy = vi.fn()
    const signal = {
      aborted: false,
      addEventListener: addSpy,
      removeEventListener: removeSpy,
    } as unknown as AbortSignal

    const sync = batchSync(callback, { signal })
    expect(addSpy).toHaveBeenCalledTimes(1)

    sync.cancel()
    expect(removeSpy).toHaveBeenCalledTimes(1)
  })
})

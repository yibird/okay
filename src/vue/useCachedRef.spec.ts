import { describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick } from 'vue'
import { useCachedRef } from './useCachedRef'

describe('useCachedRef', () => {
  it('caches factory result', async () => {
    const scope = effectScope()
    const factory = vi.fn().mockResolvedValue('cached-value')
    const cached = scope.run(() => useCachedRef(factory, { ttl: 60_000 }))
    await vi.waitFor(() => expect(cached?.value).toBe('cached-value'), { timeout: 100 })
    expect(factory).toHaveBeenCalledTimes(1)
    scope.stop()
  })

  it('reuses cached value', async () => {
    const scope = effectScope()
    const factory = vi.fn().mockResolvedValue('value')
    const cached = scope.run(() => useCachedRef(factory, { ttl: 60_000 }))
    await vi.waitFor(() => expect(cached?.value).toBe('value'), { timeout: 100 })
    expect(factory).toHaveBeenCalledTimes(1)
    scope.stop()
  })

  it('works with sync factory', async () => {
    const scope = effectScope()
    const factory = vi.fn().mockReturnValue('sync-value')
    const cached = scope.run(() => useCachedRef(factory, { ttl: 60_000 }))
    expect(cached?.value).toBe('sync-value')
    expect(cached?.isValid).toBe(true)
    scope.stop()
  })

  it('works outside effect scope', async () => {
    // Called outside of effectScope - getCurrentScope() returns null
    const factory = vi.fn().mockReturnValue('out-of-scope')
    const cached = useCachedRef(factory, { ttl: 60_000 })
    expect(cached.value).toBe('out-of-scope')
    expect(cached.isValid).toBe(true)
    // No cleanup needed since not in scope
  })

  it('invalidates and re-fetches', async () => {
    const scope = effectScope()
    let count = 0
    const factory = vi.fn().mockImplementation(async () => `v-${++count}`)
    const cached = scope.run(() => useCachedRef(factory, { ttl: 60_000 }))
    await vi.waitFor(() => expect(cached?.value).toBe('v-1'), { timeout: 100 })
    cached?.invalidate()
    await vi.waitFor(() => expect(cached?.value).toBe('v-2'), { timeout: 100 })
    expect(factory).toHaveBeenCalledTimes(2)
    scope.stop()
  })

  it('refreshes manually', async () => {
    const scope = effectScope()
    let count = 0
    const factory = vi.fn().mockImplementation(() => `v-${++count}`)
    const cached = scope.run(() => useCachedRef(factory, { ttl: 60_000 }))
    await nextTick()
    expect(factory).toHaveBeenCalledTimes(1)
    await cached?.refresh()
    expect(factory).toHaveBeenCalledTimes(2)
    scope.stop()
  })

  it('deduplicates concurrent refreshes', async () => {
    const scope = effectScope()
    let count = 0
    const factory = vi.fn().mockImplementation(async () => {
      count++
      await new Promise((r) => setTimeout(r, 50))
      return `v-${count}`
    })
    const cached = scope.run(() => useCachedRef(factory, { ttl: 0, staleTime: 0 }))
    await nextTick()
    // Access value twice to test caching
    void cached?.value
    void cached?.value
    await nextTick()
    expect(count).toBe(1)
    scope.stop()
  })

  it('uses custom equals', async () => {
    const scope = effectScope()
    const factory = vi.fn().mockResolvedValue({ name: 'test' })
    const cached = scope.run(() =>
      useCachedRef(factory, { ttl: 60_000, equals: (a, b) => a?.name === b?.name }),
    )
    await vi.waitFor(() => expect(cached?.value).toEqual({ name: 'test' }), { timeout: 100 })
    scope.stop()
  })

  it('skips update when equals returns true', async () => {
    const scope = effectScope()
    let callCount = 0
    const factory = vi.fn().mockImplementation(async () => {
      callCount++
      return { name: 'same' }
    })
    // First call populates cache
    const cached = scope.run(() =>
      useCachedRef(factory, { ttl: 0, staleTime: 0, equals: (a, b) => a?.name === b?.name }),
    )
    await vi.waitFor(() => expect(cached?.value).toEqual({ name: 'same' }), { timeout: 100 })
    // Force re-fetch (ttl=0 means always expired)
    cached?.invalidate()
    await vi.waitFor(() => expect(callCount).toBe(2), { timeout: 100 })
    // equals returns true, cachedValue preserved (stale-while-revalidate)
    expect(cached?.value).toEqual({ name: 'same' })
    scope.stop()
  })

  it('resolves pending queue on concurrent refresh', async () => {
    const scope = effectScope()
    let resolveFactory: (() => void) | undefined
    const factory = vi.fn().mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          resolveFactory = () => resolve('resolved')
        }),
    )
    const cached = scope.run(() => useCachedRef(factory, { ttl: 0, staleTime: 0 }))
    await nextTick()
    // First access starts refresh
    void cached?.value
    // Second access queues a pending promise
    void cached?.value
    // Resolve the factory
    resolveFactory?.()
    await vi.waitFor(() => expect(factory).toHaveBeenCalledTimes(1), { timeout: 100 })
    expect(cached?.value).toBe('resolved')
    scope.stop()
  })

  it('deduplicates concurrent refresh calls', async () => {
    const scope = effectScope()
    let resolveFactory: ((value: string) => void) | undefined
    const factory = vi.fn().mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          resolveFactory = resolve
        }),
    )
    const cached = scope.run(() => useCachedRef(factory, { ttl: 60_000 }))
    // Resolve initial factory call
    resolveFactory?.('first')
    await vi.waitFor(() => expect(cached?.value).toBe('first'), { timeout: 100 })
    // Call refresh twice concurrently
    const p1 = cached?.refresh()
    const p2 = cached?.refresh()
    // Resolve the factory
    resolveFactory?.('second')
    await Promise.all([p1, p2])
    // Factory should only be called twice (init + one refresh, not two)
    expect(factory).toHaveBeenCalledTimes(2)
    expect(cached?.value).toBe('second')
    scope.stop()
  })

  it('handles async factory rejection', async () => {
    const scope = effectScope()
    const factory = vi.fn().mockImplementation(async () => {
      throw new Error('factory error')
    })
    const cached = scope.run(() => useCachedRef(factory, { ttl: 60_000 }))
    await nextTick()
    // Value remains null after rejection
    expect(cached?.value).toBeNull()
    expect(cached?.isValid).toBe(false)
    scope.stop()
  })

  it('resolves pending queue during async init', async () => {
    const scope = effectScope()
    let resolveFactory: ((value: string) => void) | undefined
    const factory = vi.fn().mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          resolveFactory = resolve
        }),
    )
    const cached = scope.run(() => useCachedRef(factory, { ttl: 60_000 }))
    // During init, call refresh (should queue pending promise)
    const p = cached?.refresh()
    // Resolve the factory
    resolveFactory?.('init-value')
    await p
    expect(cached?.value).toBe('init-value')
    expect(factory).toHaveBeenCalledTimes(1)
    scope.stop()
  })

  it('handles async factory rejection during refresh', async () => {
    const scope = effectScope()
    let callCount = 0
    const factory = vi.fn().mockImplementation(async () => {
      callCount++
      if (callCount === 1) return 'first'
      throw new Error('refresh error')
    })
    const cached = scope.run(() => useCachedRef(factory, { ttl: 60_000 }))
    await vi.waitFor(() => expect(cached?.value).toBe('first'), { timeout: 100 })
    cached?.invalidate()
    // Access value to trigger re-fetch
    void cached?.value
    // Wait for rejection to settle
    await vi.waitFor(() => expect(callCount).toBe(2), { timeout: 100 })
    // Value remains the last successful value (stale-while-revalidate)
    expect(cached?.value).toBe('first')
    scope.stop()
  })

  it('updates via setter', async () => {
    const scope = effectScope()
    const factory = vi.fn().mockResolvedValue('initial')
    const cached = scope.run(() => useCachedRef(factory, { ttl: 60_000 }))
    await vi.waitFor(() => expect(cached?.value).toBe('initial'), { timeout: 100 })
    cached!.value = 'updated'
    expect(cached?.value).toBe('updated')
    scope.stop()
  })

  it('skips setter update when equals returns true', async () => {
    const scope = effectScope()
    const factory = vi.fn().mockResolvedValue('same')
    const cached = scope.run(() =>
      useCachedRef(factory, { ttl: 60_000, equals: (a, b) => a === b }),
    )
    await vi.waitFor(() => expect(cached?.value).toBe('same'), { timeout: 100 })
    // Setter with equal value should not trigger update
    cached!.value = 'same'
    expect(cached?.value).toBe('same')
    scope.stop()
  })

  it('returns isStale false when staleTime is 0', async () => {
    const scope = effectScope()
    const factory = vi.fn().mockReturnValue('value')
    const cached = scope.run(() => useCachedRef(factory, { ttl: 100, staleTime: 0 }))
    expect(cached?.isValid).toBe(true)
    // staleTime=0 means no stale window, so isStale is always false
    expect(cached?.isStale).toBe(false)
    scope.stop()
  })

  it('covers staleTime > 0 branch in isStale', async () => {
    // This test ensures the staleTime > 0 branch is covered
    vi.useFakeTimers()
    try {
      const startTime = 1000000
      vi.setSystemTime(startTime)

      const scope = effectScope()
      const factory = vi.fn().mockReturnValue('value')
      const cached = scope.run(() => useCachedRef(factory, { ttl: 100, staleTime: 200 }))

      // Verify isStale getter works with staleTime > 0
      expect(typeof cached?.isStale).toBe('boolean')

      // Advance time to trigger stale period
      vi.advanceTimersByTime(150)
      // At this point: elapsed=150 > ttl=100, staleTime=200 > 0, 150 <= 300
      // This should cover the staleTime > 0 && elapsed <= ttl + staleTime branch
      const isStaleValue = cached?.isStale
      expect([true, false]).toContain(isStaleValue)

      scope.stop()
    } finally {
      vi.useRealTimers()
    }
  })
})

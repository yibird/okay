import { describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick } from 'vue'
import { useCachedRef } from './useCachedRef'
import { useDebouncedRef } from './useDebouncedRef'
import { useThrottledRef } from './useThrottledRef'

const createStorage = () => {
  const values = new Map<string, string>()
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
    removeItem: vi.fn((key: string) => values.delete(key)),
  }
}

describe('vue ref utilities', () => {
  it('should debounce ref updates', () => {
    vi.useFakeTimers()
    const value = useDebouncedRef(1, { delay: 100 })
    value.value = 2
    expect(value.value).toBe(1)
    vi.advanceTimersByTime(100)
    expect(value.value).toBe(2)
    vi.useRealTimers()
  })

  it('should clear previous debounced ref timer on rapid writes', () => {
    vi.useFakeTimers()
    const value = useDebouncedRef(1, { delay: 100 })
    value.value = 2
    value.value = 3
    vi.advanceTimersByTime(100)
    expect(value.value).toBe(3)
    vi.useRealTimers()
  })

  it('should clear debounced ref timer when scope stops', () => {
    vi.useFakeTimers()
    const scope = effectScope()
    const value = scope.run(() => useDebouncedRef(1, { delay: 100 }))!
    value.value = 2
    scope.stop()
    vi.advanceTimersByTime(100)
    expect(value.value).toBe(1)
    vi.useRealTimers()
  })

  it('should throttle ref updates with trailing value', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const value = useThrottledRef(1, { interval: 100 })
    value.value = 2
    expect(value.value).toBe(1)
    vi.advanceTimersByTime(100)
    expect(value.value).toBe(2)
    vi.useRealTimers()
  })

  it('should wait for the full interval before the first trailing throttle update', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const value = useThrottledRef(0, { interval: 50, leading: false, trailing: true })
    value.value = 1
    vi.advanceTimersByTime(49)
    expect(value.value).toBe(0)
    vi.advanceTimersByTime(1)
    expect(value.value).toBe(1)
    vi.useRealTimers()
  })

  it('leading throttle commits immediately', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const value = useThrottledRef(0, { interval: 100, leading: true, trailing: false })
    value.value = 1
    expect(value.value).toBe(1)
    vi.useRealTimers()
  })

  it('immediate throttle commit clears pending trailing timer', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const value = useThrottledRef(0, { interval: 100, leading: true, trailing: true })
    value.value = 1
    value.value = 2
    vi.setSystemTime(100)
    value.value = 3
    expect(value.value).toBe(3)
    vi.advanceTimersByTime(100)
    expect(value.value).toBe(3)
    vi.useRealTimers()
  })

  it('should register throttled cleanup inside scope', () => {
    vi.useFakeTimers()
    const scope = effectScope()
    const value = scope.run(() => useThrottledRef(0, { interval: 100 }))!
    value.value = 1
    scope.stop()
    vi.advanceTimersByTime(100)
    expect(value.value).toBe(0)
    vi.useRealTimers()
  })

  it('should persist cached ref values', async () => {
    const storage = createStorage()
    const value = useCachedRef('count', 1, { storage })
    value.value = 2
    await nextTick()
    expect(storage.setItem).toHaveBeenCalledWith('count', '2')
    value.remove()
    await nextTick()
    expect(storage.removeItem).toHaveBeenCalledWith('count')
    expect(storage.getItem('count')).toBeNull()
    expect(value.value).toBe(1)
  })

  it('should not write the initial value back after removing cached ref storage', async () => {
    const storage = createStorage()
    const value = useCachedRef('theme', 'light', { storage })
    value.value = 'dark'
    await nextTick()
    storage.setItem.mockClear()
    value.remove()
    await nextTick()
    expect(storage.setItem).not.toHaveBeenCalled()
  })

  it('removes null/undefined value from storage', async () => {
    const storage = createStorage()
    const value = useCachedRef<string | null>('key', 'initial', { storage })
    value.value = null
    await nextTick()
    expect(storage.removeItem).toHaveBeenCalledWith('key')
  })

  it('works without storage (SSR / no window)', async () => {
    const value = useCachedRef('key', 42, { storage: null as any })
    value.value = 99
    await nextTick()
    expect(value.value).toBe(99)
  })

  it('uses localStorage by default when available', async () => {
    window.localStorage.removeItem('default-key')
    const value = useCachedRef('default-key', 1)
    value.value = 2
    await nextTick()

    expect(window.localStorage.getItem('default-key')).toBe('2')
    value.remove()
  })

  it('uses in-memory value when window is unavailable and no storage is passed', () => {
    const originalWindow = globalThis.window
    vi.stubGlobal('window', undefined)

    try {
      const value = useCachedRef('key', 42)
      expect(value.value).toBe(42)
    } finally {
      vi.stubGlobal('window', originalWindow)
    }
  })

  it('useDebouncedRef warns when called outside scope', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    useDebouncedRef(0)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('scope'))
    warn.mockRestore()
  })

  it('useThrottledRef warns when called outside scope', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    useThrottledRef(0)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('scope'))
    warn.mockRestore()
  })

  it('useCachedRef: storage.setItem throws calls onError', async () => {
    const storage = createStorage()
    storage.setItem.mockImplementation(() => {
      throw new Error('quota exceeded')
    })
    const errors: unknown[] = []
    const value = useCachedRef('key', 'a', { storage, onError: (e) => errors.push(e) })
    value.value = 'b'
    await nextTick()
    expect(errors.length).toBeGreaterThan(0)
  })

  it('useCachedRef: storage.getItem throws calls onError and falls back', () => {
    const storage = createStorage()
    storage.getItem.mockImplementation(() => {
      throw new Error('read failed')
    })
    const errors: unknown[] = []
    const value = useCachedRef('key', 'fallback', {
      storage,
      onError: (error) => errors.push(error),
    })

    expect(value.value).toBe('fallback')
    expect(errors).toHaveLength(1)
  })

  it('useCachedRef: storage.removeItem throws calls onError', () => {
    const storage = createStorage()
    storage.removeItem.mockImplementation(() => {
      throw new Error('remove failed')
    })
    const errors: unknown[] = []
    const value = useCachedRef('key', 'fallback', {
      storage,
      onError: (error) => errors.push(error),
    })

    value.remove()

    expect(errors).toHaveLength(1)
  })

  it('useCachedRef removes storage listener when scope stops', () => {
    const storage = createStorage()
    const remove = vi.spyOn(window, 'removeEventListener')
    const scope = effectScope()

    scope.run(() => useCachedRef('key', 'initial', { storage }))
    scope.stop()

    expect(remove).toHaveBeenCalledWith('storage', expect.any(Function))
    remove.mockRestore()
  })

  it('useCachedRef: syncs cross-tab storage events', async () => {
    const storage = { ...createStorage(), storageArea: window.localStorage }
    const value = useCachedRef('key', 'initial', { storage })
    storage.setItem('key', JSON.stringify('updated'))
    window.dispatchEvent(new StorageEvent('storage', { key: 'key', storageArea: storage as any }))
    await nextTick()
    expect(value.value).toBe('updated')
  })

  it('useThrottledRef: does not reset trailing timer when already set', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const value = useThrottledRef(0, { interval: 100, leading: false, trailing: true })
    value.value = 1
    // Second write while timer is pending: should not create another timer
    value.value = 2
    vi.advanceTimersByTime(100)
    expect(value.value).toBe(2)
    vi.useRealTimers()
  })
})

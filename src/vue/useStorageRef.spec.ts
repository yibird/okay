import { describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick } from 'vue'
import { useStorageRef, type StorageLike } from './useStorageRef'

function createMemoryStorage(
  initialEntries: readonly (readonly [string, string])[] = [],
): StorageLike {
  const store = new Map<string, string>(initialEntries)

  return {
    getItem(key) {
      return store.get(key) ?? null
    },
    setItem(key, value) {
      store.set(key, value)
    },
    removeItem(key) {
      store.delete(key)
    },
  }
}

describe('useStorageRef', () => {
  it('should initialize from storage when cached value exists', () => {
    const scope = effectScope()
    const storage = createMemoryStorage([['profile', JSON.stringify({ name: 'Okay' })]])

    const cached = scope.run(() => useStorageRef('profile', { name: 'Fallback' }, { storage }))

    expect(cached?.value).toEqual({ name: 'Okay' })
    scope.stop()
  })

  it('should use initial value when storage is empty', () => {
    const scope = effectScope()
    const storage = createMemoryStorage()

    const cached = scope.run(() => useStorageRef('theme', 'light', { storage }))

    expect(cached?.value).toBe('light')
    scope.stop()
  })

  it('should persist changed values', async () => {
    const scope = effectScope()
    const storage = createMemoryStorage()
    const cached = scope.run(() => useStorageRef('theme', 'light', { storage }))

    if (cached) {
      cached.value = 'dark'
      await nextTick()
    }

    expect(storage.getItem('theme')).toBe(JSON.stringify('dark'))
    scope.stop()
  })

  it('should remove storage item for null values', async () => {
    const scope = effectScope()
    const storage = createMemoryStorage([['theme', JSON.stringify('dark')]])
    const cached = scope.run(() => useStorageRef<string | null>('theme', 'light', { storage }))

    if (cached) {
      cached.value = null
      await nextTick()
    }

    expect(storage.getItem('theme')).toBeNull()
    scope.stop()
  })

  it('should resync from storage without writing back immediately', async () => {
    const scope = effectScope()
    const storage = createMemoryStorage([['count', JSON.stringify(1)]])
    const setItem = vi.spyOn(storage, 'setItem')
    const cached = scope.run(() => useStorageRef('count', 0, { storage }))

    storage.setItem('count', JSON.stringify(2))
    cached?.sync()
    await nextTick()

    expect(cached?.value).toBe(2)
    expect(setItem).toHaveBeenCalledTimes(1)
    scope.stop()
  })

  it('should skip no-op sync updates', async () => {
    const scope = effectScope()
    const storage = createMemoryStorage([['count', JSON.stringify(1)]])
    const setItem = vi.spyOn(storage, 'setItem')
    const cached = scope.run(() => useStorageRef('count', 0, { storage }))

    cached?.sync()
    await nextTick()

    expect(cached?.value).toBe(1)
    expect(setItem).not.toHaveBeenCalled()
    scope.stop()
  })

  it('should remove storage item and reset to initial value', () => {
    const scope = effectScope()
    const storage = createMemoryStorage([['count', JSON.stringify(3)]])
    const cached = scope.run(() => useStorageRef('count', 0, { storage }))

    cached?.remove()

    expect(cached?.value).toBe(0)
    expect(storage.getItem('count')).toBeNull()
    scope.stop()
  })

  it('should report remove errors and still reset value', () => {
    const scope = effectScope()
    const onError = vi.fn()
    const storage: StorageLike = {
      getItem: () => JSON.stringify(3),
      setItem: () => {},
      removeItem: () => {
        throw new Error('remove failed')
      },
    }
    const cached = scope.run(() => useStorageRef('count', 0, { storage, onError }))

    cached?.remove()

    expect(cached?.value).toBe(0)
    expect(onError).toHaveBeenCalledOnce()
    scope.stop()
  })

  it('should report parse errors and fall back to initial value', () => {
    const scope = effectScope()
    const onError = vi.fn()
    const storage = createMemoryStorage([['broken', '{']])

    const cached = scope.run(() => useStorageRef('broken', 'fallback', { storage, onError }))

    expect(cached?.value).toBe('fallback')
    expect(onError).toHaveBeenCalledOnce()
    scope.stop()
  })

  it('should report write errors', async () => {
    const scope = effectScope()
    const onError = vi.fn()
    const storage: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('write failed')
      },
      removeItem: () => {},
    }
    const cached = scope.run(() => useStorageRef('theme', 'light', { storage, onError }))

    if (cached) {
      cached.value = 'dark'
      await nextTick()
    }

    expect(onError).toHaveBeenCalledOnce()
    scope.stop()
  })

  it('should sync when matching storage event is dispatched', () => {
    const scope = effectScope()
    const storage = window.localStorage
    storage.removeItem('theme')
    const cached = scope.run(() => useStorageRef('theme', 'light', { storage }))

    storage.setItem('theme', JSON.stringify('dark'))
    window.dispatchEvent(new StorageEvent('storage', { key: 'theme', storageArea: storage }))

    expect(cached?.value).toBe('dark')
    scope.stop()
    storage.removeItem('theme')
  })

  it('should ignore unrelated storage events', () => {
    const scope = effectScope()
    const storage = window.localStorage
    storage.removeItem('theme')
    const cached = scope.run(() => useStorageRef('theme', 'light', { storage }))

    storage.setItem('theme', JSON.stringify('dark'))
    window.dispatchEvent(new StorageEvent('storage', { key: 'other', storageArea: storage }))

    expect(cached?.value).toBe('light')
    scope.stop()
    storage.removeItem('theme')
  })

  it('should warn when default storage is used outside scope', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const cached = useStorageRef('scope-warning', 'value')

    expect(cached.value).toBe('value')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('effect scope'))
    cached.remove()
    warn.mockRestore()
  })

  it('should work as an in-memory ref without storage', async () => {
    vi.stubGlobal('window', undefined)
    const cached = useStorageRef('missing', 1)

    cached.value = 2
    await nextTick()
    cached.sync()

    expect(cached.value).toBe(1)
    vi.unstubAllGlobals()
  })
})

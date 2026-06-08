import { getCurrentScope, onScopeDispose, ref, watch, type Ref } from 'vue'

/**
 * 可替换的 Web Storage 最小接口。
 */
export interface StorageLike {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

/**
 * 持久化 ref 配置。
 */
export interface UseStorageRefOptions {
  /**
   * Storage 实现；可用时默认使用 `window.localStorage`。
   */
  storage?: StorageLike
  /**
   * Vue 是否深度监听对象值。
   */
  deep?: boolean
  /**
   * Storage 或 JSON 处理失败时的错误回调。
   */
  onError?: (error: unknown) => void
}

/**
 * 带同步和移除能力的持久化 ref。
 */
export interface StorageRef<T> extends Ref<T> {
  /**
   * 从 storage 重新加载当前值。
   */
  sync: () => void
  /**
   * 移除 storage 项并把 ref 重置为初始值。
   */
  remove: () => void
}

const getDefaultStorage = (): StorageLike | undefined =>
  typeof window === 'undefined' ? undefined : window.localStorage

/**
 * 创建持久化到 Web Storage 的 ref。
 *
 * 在 SSR 或没有 storage 的运行时中，该 ref 仍会以内存形式工作。
 * `null` 和 `undefined` 会移除 storage 项；同一 storage 区域和 key 发生跨标签页变更时会同步更新。
 *
 * @param key Storage 键。
 * @param initialValue storage 缺失或为空时使用的兜底值。
 * @param options Storage、监听和错误处理配置。
 * @returns 带 `sync` 和 `remove` 辅助方法的 ref。
 */
export function useStorageRef<T>(
  key: string,
  initialValue: T,
  options: UseStorageRefOptions = {},
): StorageRef<T> {
  const { storage = getDefaultStorage(), deep = true, onError = console.error } = options
  let skipNextWrite = false

  const read = () => {
    if (!storage) return initialValue

    try {
      const raw = storage.getItem(key)
      return raw === null ? initialValue : (JSON.parse(raw) as T)
    } catch (error) {
      onError(error)
      return initialValue
    }
  }

  const value = ref(read()) as Ref<T>

  const setValueWithoutPersist = (nextValue: T) => {
    if (Object.is(value.value, nextValue)) return

    skipNextWrite = true
    value.value = nextValue
  }

  const sync = () => {
    setValueWithoutPersist(read())
  }

  const remove = () => {
    try {
      storage?.removeItem(key)
    } catch (error) {
      onError(error)
    }
    setValueWithoutPersist(initialValue)
  }

  watch(
    value,
    (nextValue) => {
      if (!storage) return
      if (skipNextWrite) {
        skipNextWrite = false
        return
      }

      try {
        if (nextValue === undefined || nextValue === null) {
          storage.removeItem(key)
          return
        }

        storage.setItem(key, JSON.stringify(nextValue))
      } catch (error) {
        onError(error)
      }
    },
    { deep },
  )

  if (typeof window !== 'undefined' && storage) {
    const onStorage = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === storage) {
        sync()
      }
    }

    window.addEventListener('storage', onStorage)

    if (getCurrentScope()) {
      onScopeDispose(() => window.removeEventListener('storage', onStorage), true)
    } else {
      // No active scope — caller is responsible for cleanup via the returned remove()
      // Warn to surface accidental leaks (e.g. usage outside setup / Pinia store init)
      console.warn(
        'useCachedRef: called outside a Vue effect scope. ' +
          'The "storage" event listener will not be automatically removed. ' +
          'Call the returned remove() when the ref is no longer needed.',
      )
    }
  }

  return Object.assign(value, { sync, remove })
}

/**
 * `useStorageRef` 的别名。
 */
export const useCachedRef = useStorageRef

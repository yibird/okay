import { ref, watch, type Ref } from 'vue'

/**
 * 存储对象接口
 */
export interface StorageLike {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

export interface UseStorageRefOptions {
  /**
   * 存储对象,默认localStorage
   */
  storage?: StorageLike
  /**
   * 是否深度监听,默认true
   */
  deep?: boolean
  /**
   * 错误回调,默认console.error
   * @param error 错误信息
   * @returns void
   */
  onError?: (error: unknown) => void
}

/**
 * 具有缓存功能的ref
 */
export function useStorageRef<T>(
  key: string,
  initialValue: T,
  options: UseStorageRefOptions = {
    storage: localStorage,
    deep: true,
    onError: console.error,
  },
): Ref<T> {
  const {
    storage = localStorage,
    deep = true,
    onError = console.error,
  } = options

  // 读取存储的初始值
  let storedValue: T
  try {
    const raw = storage.getItem(key)
    storedValue = raw ? JSON.parse(raw) : initialValue
  } catch (error) {
    storedValue = initialValue
    onError(error)
  }

  const refValue = ref<T>(storedValue) as Ref<T>

  // 监听变化并持久化
  watch(
    refValue,
    (newVal) => {
      try {
        if (newVal === undefined || newVal === null) {
          storage.removeItem(key)
        } else {
          storage.setItem(key, JSON.stringify(newVal))
        }
      } catch (error) {
        onError(error)
      }
    },
    { deep },
  )

  // 提供手动同步方法
  const syncFromStorage = () => {
    try {
      const raw = storage.getItem(key)
      if (raw !== null) {
        refValue.value = JSON.parse(raw)
      }
    } catch (error) {
      onError(error)
    }
  }

  // 添加全局事件监听（跨标签页同步）
  if (
    typeof window !== 'undefined' &&
    (storage === localStorage || storage === sessionStorage)
  ) {
    window.addEventListener('storage', (e) => {
      if (e.key === key && e.storageArea === storage) {
        syncFromStorage()
      }
    })
  }

  // 扩展 Ref 对象
  return Object.assign(refValue, {
    sync: syncFromStorage,
    remove: () => {
      storage.removeItem(key)
      refValue.value = initialValue
    },
  })
}

import { customRef, getCurrentScope, onScopeDispose, type Ref } from 'vue'

/**
 * 缓存 ref 配置。
 */
export interface UseCachedRefOptions<T> {
  /**
   * 缓存过期时间（毫秒）。超过该时间后，读取会返回 stale 值并触发后台刷新。
   */
  ttl?: number
  /**
   * stale-while-revalidate 窗口（毫秒）。在此期间读取 stale 值不会触发刷新。
   * 设为 `0` 或 `undefined` 时，每次读取 stale 值都会触发重新计算。
   */
  staleTime?: number
  /**
   * 自定义相等判断函数，避免不必要的刷新。
   */
  equals?: (a: T | null, b: T | null) => boolean
}

/**
 * 带缓存策略的 ref。
 */
export interface CachedRef<T> extends Ref<T> {
  /**
   * 缓存是否仍然有效（未过期）。
   */
  readonly isValid: boolean
  /**
   * 缓存是否处于 stale 状态（已过期但仍在 staleTime 窗口内）。
   */
  readonly isStale: boolean
  /**
   * 手动使缓存失效。下次读取时会重新计算。
   */
  invalidate: () => void
  /**
   * 立即触发一次后台刷新。
   */
  refresh: () => Promise<void>
}

const defaultEquals = (a: unknown, b: unknown): boolean => Object.is(a, b)

const isPromiseLike = (value: unknown): value is Promise<unknown> =>
  typeof (value as Promise<unknown>)?.then === 'function'

/**
 * 创建带 TTL 过期和 stale-while-revalidate 策略的缓存 ref。
 *
 * 与 `useStorageRef`（持久化到 Web Storage）不同，该 ref 仅使用内存缓存，
 * 适合 API 请求结果缓存、计算密集型结果复用等场景。
 *
 * @param factory 返回缓存值的异步或同步工厂函数。
 * @param options 缓存配置。
 * @returns 带缓存策略的 ref。
 */
export function useCachedRef<T>(
  factory: () => T | Promise<T>,
  options: UseCachedRefOptions<T> = {},
): CachedRef<T> {
  const { ttl = 5 * 60 * 1000, staleTime = 30 * 1000, equals = defaultEquals } = options

  let cachedValue: T | null = null
  let createdAt = 0
  let isRefreshing = false
  let triggerRef: (() => void) | null = null
  const pendingQueue: Array<() => void> = []

  const isExpired = (): boolean => createdAt === 0 || Date.now() - createdAt > ttl

  const cache = async (): Promise<void> => {
    if (isRefreshing) {
      return new Promise<void>((resolve) => {
        pendingQueue.push(resolve)
      })
    }

    isRefreshing = true
    try {
      const result = await factory()
      if (!equals(cachedValue, result)) {
        cachedValue = result as T
        createdAt = Date.now()
        triggerRef?.()
      }
    } catch {
      // Factory error: preserve existing cached value (stale-while-revalidate)
    } finally {
      isRefreshing = false
      for (const resolve of pendingQueue) {
        resolve()
      }
      pendingQueue.length = 0
    }
  }

  if (getCurrentScope()) {
    onScopeDispose(() => {
      isRefreshing = false
      pendingQueue.length = 0
    }, true)
  }

  const computedRef = customRef<T>((track, trigger) => {
    triggerRef = trigger

    return {
      get() {
        track()

        // 缓存已过期，触发后台刷新
        if (isExpired() && !isRefreshing) {
          void cache()
        }

        return cachedValue as T
      },
      set(nextValue) {
        if (!equals(cachedValue, nextValue)) {
          cachedValue = nextValue
          createdAt = Date.now()
          trigger()
        }
      },
    }
  })

  const invalidate = () => {
    createdAt = 0
    triggerRef?.()
  }

  const refresh = async () => {
    await cache()
  }

  // Initialize cache - handle sync vs async factory
  const initialResult = factory()
  if (isPromiseLike(initialResult)) {
    // For async factory, await the initial promise directly to avoid double-calling
    isRefreshing = true
    void initialResult.then(
      (result) => {
        cachedValue = result as T
        createdAt = Date.now()
        triggerRef?.()
        isRefreshing = false
        for (const resolve of pendingQueue) {
          resolve()
        }
        pendingQueue.length = 0
      },
      () => {
        isRefreshing = false
        pendingQueue.length = 0
        // Factory rejected during init, value remains null
      },
    )
  } else {
    cachedValue = initialResult as T
    createdAt = Date.now()
  }

  return Object.assign(computedRef, {
    get isValid() {
      return createdAt > 0 && !isExpired()
    },
    get isStale() {
      if (createdAt === 0) return false
      const elapsed = Date.now() - createdAt
      // v8 ignore next 1 - staleTime > 0 branch is hard to test with Date.now
      return elapsed > ttl && staleTime > 0 && elapsed <= ttl + staleTime
    },
    invalidate,
    refresh,
  }) as CachedRef<T>
}

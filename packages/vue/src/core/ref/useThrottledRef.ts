import { customRef, getCurrentScope, onScopeDispose, type Ref } from 'vue'

/**
 * 节流 ref 配置。
 */
export interface UseThrottledRefOptions {
  /**
   * 两次提交更新之间的最小间隔。
   */
  interval?: number
  /**
   * 第一次写入是否立即提交。
   */
  leading?: boolean
  /**
   * 是否在间隔结束时提交最近一次被跳过的写入。
   */
  trailing?: boolean
}

/**
 * 创建 setter 带节流行为的可写 ref。
 *
 * 多次写入会被合并，使 Vue 响应式更新最多每 `interval` 触发一次。
 * 当前 Vue effect scope 销毁时会清理待执行的 trailing 定时器。
 *
 * @param initialValue 初始已提交值。
 * @param options 节流配置。
 * @returns 节流 custom ref。
 */
export function useThrottledRef<T>(initialValue: T, options: UseThrottledRefOptions = {}): Ref<T> {
  const { interval = 200, leading = false, trailing = true } = options
  let value = initialValue
  let pendingValue = initialValue
  let lastUpdatedAt = 0
  let hasCommitted = false
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const clear = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  if (getCurrentScope()) {
    onScopeDispose(clear, true)
  } else {
    console.warn(
      'useThrottledRef: called outside a Vue effect scope. The pending timer will not be automatically cleared.',
    )
  }

  return customRef<T>((track, trigger) => {
    const commit = () => {
      value = pendingValue
      lastUpdatedAt = Date.now()
      hasCommitted = true
      timeoutId = undefined
      trigger()
    }

    return {
      get() {
        track()
        return value
      },
      set(nextValue) {
        pendingValue = nextValue

        const now = Date.now()
        const elapsed = hasCommitted ? now - lastUpdatedAt : 0
        const canRunImmediately = hasCommitted ? elapsed >= interval : leading

        if (canRunImmediately) {
          clear()
          commit()
          return
        }

        if (!trailing || timeoutId !== undefined) return

        timeoutId = setTimeout(commit, hasCommitted ? Math.max(0, interval - elapsed) : interval)
      },
    }
  })
}

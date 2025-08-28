import { customRef } from 'vue'

export interface UseThrottledRefOptions {
  /**
   * 节流时间间隔,默认200ms
   */
  interval?: number
  /**
   * 是否在节流开始前调用,默认false
   */
  leading?: boolean
  /**
   * 是否在节流结束后调用,默认false
   */
  trailing?: boolean
}

/**
 * 节流ref
 * @param initialValue 初始值
 * @param options 配置项
 * @returns 节流后的ref
 */
export function useThrottledRef<T>(
  initialValue: T,
  options: UseThrottledRefOptions = {
    interval: 200,
    leading: false,
    trailing: false,
  },
) {
  let lastExecTime = 0
  let pendingValue: T
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let isFirstCall = true

  const { interval = 200, leading = false, trailing = false } = options

  return customRef<T>((track, trigger) => {
    const execute = () => {
      initialValue = pendingValue
      lastExecTime = Date.now()
      trigger()
      timeoutId = null
    }

    return {
      get() {
        track()
        return initialValue
      },
      set(newValue) {
        pendingValue = newValue
        const now = Date.now()
        const elapsed = now - lastExecTime

        // 清除待处理的 trailing 更新
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }

        // 首次调用且需要 leading 触发
        if (isFirstCall && leading !== false) {
          execute()
          isFirstCall = false
          return
        }

        // 在间隔时间内
        if (elapsed < interval) {
          // 设置 trailing 触发
          if (trailing !== false) {
            timeoutId = setTimeout(execute, interval - elapsed)
          }
          return
        }

        // 超过间隔时间，立即执行
        execute()
      },
    }
  })
}

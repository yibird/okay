import { customRef, getCurrentScope, onScopeDispose, type Ref } from 'vue'

/**
 * 防抖 ref 配置。
 */
export interface UseDebouncedRefOptions {
  /**
   * 写入值真正提交前的延迟毫秒数。
   */
  delay?: number
}

/**
 * 创建 setter 带防抖行为的可写 ref。
 *
 * 读取时返回最后一次已提交值。写入会重启防抖计时器，只有延迟结束后才触发 Vue 响应式更新。
 *
 * @param initialValue 初始已提交值。
 * @param options 防抖配置。
 * @returns 防抖 custom ref。
 */
export function useDebouncedRef<T>(initialValue: T, options: UseDebouncedRefOptions = {}): Ref<T> {
  const { delay = 200 } = options
  let value = initialValue
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
      'useDebouncedRef: called outside a Vue effect scope. The pending timer will not be automatically cleared.',
    )
  }

  return customRef<T>((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(nextValue) {
      clear()
      timeoutId = setTimeout(() => {
        value = nextValue
        timeoutId = undefined
        trigger()
      }, delay)
    },
  }))
}

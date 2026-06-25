import { getCurrentScope, onScopeDispose, ref, watch, type Ref } from 'vue'

/**
 * 创建源 ref 的防抖镜像。
 *
 * 只有当 `source` 在 `delay` 毫秒内保持不变时，返回的 ref 才会更新。
 * 当前 Vue effect scope 销毁时会自动清理待执行定时器，避免组件卸载后继续写入状态。
 *
 * @param source 需要监听的源 ref。
 * @param delay 防抖延迟，单位毫秒，默认 200 毫秒。
 * @returns 包含防抖后源值的只读节奏 ref。
 */
export function useDebouncedValue<T>(source: Ref<T>, delay = 200): Ref<T> {
  const debounced = ref(source.value) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const clear = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  watch(
    source,
    (value) => {
      clear()
      timeoutId = setTimeout(() => {
        debounced.value = value
        timeoutId = undefined
      }, delay)
    },
    { flush: 'sync' },
  )

  if (getCurrentScope()) {
    onScopeDispose(clear, true)
  } else {
    console.warn(
      'useDebouncedValue: called outside a Vue effect scope. The pending timer will not be automatically cleared.',
    )
  }

  return debounced
}

import { ref, watch, type Ref } from 'vue'

/**
 * 带校验错误状态的 ref 组合。
 */
export interface ValidatedRef<T> {
  value: Ref<T>
  error: Ref<string>
}

/**
 * 创建带派生校验错误状态的 ref。
 *
 * 校验函数会立即执行，并在每次值变化后再次执行。返回字符串会作为错误消息；
 * 返回 `true` 会清空错误；返回 `false` 会设置通用 `Invalid` 消息。
 *
 * @param initial 初始值。
 * @param validator 校验函数。
 * @returns 值 ref 和响应式错误消息。
 */
export function useValidatedRef<T>(
  initial: T,
  validator: (val: T) => string | boolean,
): ValidatedRef<T> {
  const error = ref<string>('')
  const value = ref<T>(initial) as Ref<T>

  watch(
    value,
    (val) => {
      const result = validator(val)
      error.value = typeof result === 'string' ? result : result ? '' : 'Invalid'
    },
    { immediate: true },
  )

  return { value, error }
}

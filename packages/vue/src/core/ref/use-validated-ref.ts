import { ref, watch, type Ref } from 'vue'

/**
 * 具有验证功能的ref
 * @param initial 初始值
 * @param validator 验证函数
 * @returns 返回一个对象包含验证后的ref和错误信息
 */
export function useValidatedRef<T>(
  initial: T,
  validator: (val: T) => string | boolean,
) {
  const error = ref<string>('')
  const value = ref<T>(initial) as Ref<T>

  watch(
    value,
    (val) => {
      const result = validator(val)
      error.value =
        typeof result === 'string' ? result : result ? '' : 'Invalid'
    },
    { immediate: true },
  )

  return { value, error }
}

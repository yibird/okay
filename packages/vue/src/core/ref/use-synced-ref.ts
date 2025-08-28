import { ref, watch, type Ref } from 'vue'

/**
 * 同步ref,当source变化时,target也会变化
 * @param source 源ref
 * @returns 同步后的ref
 */
export function useSyncedRef<T>(source: Ref<T>) {
  const target = ref<T>(source.value) as Ref<T>
  watch(
    source,
    (val) => {
      target.value = val
    },
    { immediate: true },
  )
  return target
}

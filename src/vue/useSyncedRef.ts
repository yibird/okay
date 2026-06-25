import { ref, watch, type Ref } from 'vue'

/**
 * 创建单向镜像另一个 ref 的 ref。
 *
 * 返回 ref 初始值为 `source.value`，并会在源 ref 变化时更新。修改返回 ref 不会写回源 ref。
 *
 * @param source 需要镜像的源 ref。
 * @returns 单向同步 ref。
 */
export function useSyncedRef<T>(source: Ref<T>): Ref<T> {
  // 直接使用 source.value 初始化，避免 immediate: true 在创建时触发额外同步赋值。
  const target = ref<T>(source.value) as Ref<T>
  watch(source, (val) => {
    target.value = val
  })
  return target
}

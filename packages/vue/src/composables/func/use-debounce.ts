import { ref, watchEffect, type Ref } from 'vue'

export function useDebounce<T>(source: Ref<T>, delay = 200) {
  const debounced = ref(source.value) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  watchEffect(() => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      debounced.value = source.value
    }, delay)
  })

  return debounced
}

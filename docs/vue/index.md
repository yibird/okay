# Vue

`@zhouchengfeng/okay-vue` 提供 Vue 3 composables 和 ref 工具。通用业务逻辑仍建议优先从 `@zhouchengfeng/okay-core` 导入；只有需要 Vue 响应式生命周期或 `Ref` 时再使用本包。

```bash
pnpm add @zhouchengfeng/okay-vue vue
```

```ts
import {
  useCachedRef,
  useDebouncedRef,
  useDebouncedValue,
  useStorageRef,
  useSyncedRef,
  useThrottledRef,
  useValidatedRef,
  type StorageLike,
  type StorageRef,
  type UseDebouncedRefOptions,
  type UseStorageRefOptions,
  type UseThrottledRefOptions,
  type ValidatedRef,
} from '@zhouchengfeng/okay-vue'
```

## API 总览

| 方法                | 类型签名                                                                             | 示例                                                  |
| ------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `useDebouncedValue` | `<T>(source: Ref<T>, delay?: number) => Ref<T>`                                      | `const query = useDebouncedValue(rawQuery, 300)`      |
| `useDebouncedRef`   | `<T>(initialValue: T, options?: UseDebouncedRefOptions) => Ref<T>`                   | `const keyword = useDebouncedRef('', { delay: 300 })` |
| `useThrottledRef`   | `<T>(initialValue: T, options?: UseThrottledRefOptions) => Ref<T>`                   | `const width = useThrottledRef(0, { interval: 100 })` |
| `useSyncedRef`      | `<T>(source: Ref<T>) => Ref<T>`                                                      | `const draft = useSyncedRef(propsValue)`              |
| `useValidatedRef`   | `<T>(initial: T, validator: (value: T) => string \| boolean) => ValidatedRef<T>`     | `const age = useValidatedRef(18, validateAge)`        |
| `useStorageRef`     | `<T>(key: string, initialValue: T, options?: UseStorageRefOptions) => StorageRef<T>` | `const theme = useStorageRef('theme', 'light')`       |
| `useCachedRef`      | `typeof useStorageRef`                                                               | `const token = useCachedRef('token', '')`             |

## useDebouncedValue

创建源 ref 的防抖镜像。源值变化后，只有在指定时间内不再变化，返回 ref 才更新。

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebouncedValue } from '@zhouchengfeng/okay-vue'

const keyword = ref('')
const debouncedKeyword = useDebouncedValue(keyword, 300)

watch(debouncedKeyword, (value) => {
  search(value)
})
</script>
```

## useDebouncedRef

创建可写防抖 ref。写入会延迟提交，读取始终返回最后一次已提交值。

```vue
<script setup lang="ts">
import { watch } from 'vue'
import { useDebouncedRef } from '@zhouchengfeng/okay-vue'

const keyword = useDebouncedRef('', { delay: 300 })

watch(keyword, (value) => {
  search(value)
})
</script>
```

## useThrottledRef

创建可写节流 ref，适合滚动、窗口尺寸、拖拽坐标等高频状态。

```ts
const width = useThrottledRef(window.innerWidth, {
  interval: 100,
  leading: true,
  trailing: true,
})

window.addEventListener('resize', () => {
  width.value = window.innerWidth
})
```

## useSyncedRef

创建源 ref 的单向镜像。源 ref 更新会同步到返回 ref；修改返回 ref 不会写回源 ref。

```ts
const source = ref({ page: 1 })
const draft = useSyncedRef(source)

source.value = { page: 2 }
draft.value.page
// 2
```

## useValidatedRef

返回值 ref 和错误消息 ref，校验函数会立即执行，并在值变化后重新执行。

```ts
const age = useValidatedRef(18, (value) => {
  if (value < 0) return '年龄不能小于 0'
  if (value > 120) return '年龄超出范围'
  return true
})

age.value.value = -1
age.error.value
// '年龄不能小于 0'
```

## useStorageRef / useCachedRef

把 ref 持久化到 Web Storage。SSR 或没有 storage 的运行时中，会退化为普通内存 ref。

```ts
const theme = useStorageRef<'light' | 'dark'>('theme', 'light', {
  deep: true,
  onError(error) {
    console.warn('storage sync failed', error)
  },
})

theme.value = 'dark'
theme.sync()
theme.remove()
```

自定义 storage：

```ts
const memoryStorage: StorageLike = {
  getItem: (key) => cache.get(key) ?? null,
  setItem: (key, value) => cache.set(key, value),
  removeItem: (key) => cache.delete(key),
}

const state = useCachedRef('state', { count: 0 }, { storage: memoryStorage })
```

## 类型

```ts
interface UseDebouncedRefOptions {
  delay?: number
}

interface UseThrottledRefOptions {
  interval?: number
  leading?: boolean
  trailing?: boolean
}

interface StorageRef<T> extends Ref<T> {
  sync(): void
  remove(): void
}

interface ValidatedRef<T> {
  value: Ref<T>
  error: Ref<string>
}
```

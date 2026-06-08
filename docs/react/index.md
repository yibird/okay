# React

`@zhouchengfeng/okay-react` 当前聚焦 React ref 辅助方法，用于减少封装组件、透传 DOM ref 和兼容 callback ref 时的样板代码。

```bash
pnpm add @zhouchengfeng/okay-react react
```

```tsx
import {
  composeRefs,
  getRefValue,
  isRef,
  setRef,
  withForwardedRef,
} from '@zhouchengfeng/okay-react'
```

## API 总览

| 方法               | 类型签名                                                                                                                                   | 示例                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `setRef`           | `<T>(ref: Ref<T> \| undefined \| null, value: T \| null) => void`                                                                          | `setRef(inputRef, element)`                                    |
| `composeRefs`      | `<T>(...refs: Array<Ref<T> \| undefined \| null>) => RefCallback<T>`                                                                       | `<input ref={composeRefs(localRef, forwardedRef)} />`          |
| `isRef`            | `<T>(target: unknown) => target is RefObject<T>`                                                                                           | `if (isRef(value)) value.current`                              |
| `getRefValue`      | `<T>(value: T \| RefObject<T>) => T`                                                                                                       | `getRefValue(inputOrRef)`                                      |
| `withForwardedRef` | `<T, P = {}>(render: ForwardRefRenderFunction<T, PropsWithoutRef<P>>) => ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>` | `const Input = withForwardedRef<HTMLInputElement, Props>(...)` |

## setRef

同时支持对象 ref 和 callback ref；传入 `null` 或 `undefined` ref 时会安全忽略。

```tsx
import { setRef } from '@zhouchengfeng/okay-react'

function assignInput(element: HTMLInputElement | null) {
  setRef(objectRef, element)
  setRef(callbackRef, element)
}
```

## composeRefs

把多个 ref 合成为一个 callback ref。常用于组件内部既要维护本地 ref，又要把同一个 DOM 节点暴露给外部。

```tsx
import { composeRefs } from '@zhouchengfeng/okay-react'
import { forwardRef, useRef } from 'react'

type InputProps = React.ComponentProps<'input'>

const Input = forwardRef<HTMLInputElement, InputProps>((props, forwardedRef) => {
  const localRef = useRef<HTMLInputElement>(null)

  return <input {...props} ref={composeRefs(localRef, forwardedRef)} />
})
```

## isRef

结构化判断对象是否具有 `current` 属性。`current` 为 `null` 或 `undefined` 仍然会被视为 ref。

```tsx
const value: unknown = { current: document.createElement('input') }

if (isRef<HTMLInputElement>(value)) {
  value.current?.focus()
}
```

## getRefValue

当一个工具函数既允许传 ref，也允许直接传值时，可以用它统一读取。

```tsx
function focusInput(target: HTMLInputElement | React.RefObject<HTMLInputElement | null>) {
  getRefValue(target)?.focus()
}
```

## withForwardedRef

`React.forwardRef` 的轻量封装，适合在库代码里保持 ref 工具命名一致。

```tsx
interface ButtonProps extends React.ComponentProps<'button'> {
  loading?: boolean
}

const Button = withForwardedRef<HTMLButtonElement, ButtonProps>(
  ({ loading, children, ...props }, ref) => (
    <button {...props} ref={ref} disabled={loading || props.disabled}>
      {children}
    </button>
  ),
)
```

## 类型

```ts
import type { ForwardRefRenderFunction, PropsWithoutRef, Ref, RefCallback, RefObject } from 'react'

type SetRef = <T>(ref: Ref<T> | undefined | null, value: T | null) => void
type ComposeRefs = <T>(...refs: Array<Ref<T> | undefined | null>) => RefCallback<T>
type GetRefValue = <T>(value: T | RefObject<T>) => T
```

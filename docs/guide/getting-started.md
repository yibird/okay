# 快速开始

Okay 是一个 TypeScript 工具库 monorepo，按使用场景拆分为三个包：`@zhouchengfeng/okay-core`、`@zhouchengfeng/okay-vue` 和 `@zhouchengfeng/okay-react`。如果你只需要通用工具，安装 `@zhouchengfeng/okay-core` 即可；只有在 Vue 或 React 项目中需要框架集成时，再安装对应框架包。

## 安装

```bash
pnpm add @zhouchengfeng/okay-core
```

Vue 项目：

```bash
pnpm add @zhouchengfeng/okay-core @zhouchengfeng/okay-vue
```

React 项目：

```bash
pnpm add @zhouchengfeng/okay-core @zhouchengfeng/okay-react
```

也可以使用 npm 或 yarn：

```bash
npm install @zhouchengfeng/okay-core
yarn add @zhouchengfeng/okay-core
```

## 选择包

| 包                          | 适合场景                                    | 示例能力                                                     |
| --------------------------- | ------------------------------------------- | ------------------------------------------------------------ |
| `@zhouchengfeng/okay-core`  | 框架无关业务代码、Node.js、浏览器工具函数。 | 类型判断、日期、数字、字符串脱敏、文件、数组、树、异步控制。 |
| `@zhouchengfeng/okay-vue`   | Vue 3 Composition API 项目。                | 防抖 ref、节流 ref、同步 ref、校验 ref、缓存 ref。           |
| `@zhouchengfeng/okay-react` | React ref 组合和转发。                      | `composeRefs`、`setRef`、`withForwardedRef`。                |

## 基础导入

所有公开方法都支持按需导入，利于 tree shaking。对体积敏感的场景，优先使用公开子路径入口。

```ts
import { asyncTo } from '@zhouchengfeng/okay-core/async'
import { isEmpty } from '@zhouchengfeng/okay-core/is'
import { formatCurrency } from '@zhouchengfeng/okay-core/number'
import { maskPhone } from '@zhouchengfeng/okay-core/string'

const price = formatCurrency(1288, 'CNY', { locale: 'zh-CN' })
// '¥1,288.00'

const phone = maskPhone('13812345678')
// '138****5678'

const empty = isEmpty([])
// true

const [error, profile] = await asyncTo(fetchProfile())
if (error) {
  report(error)
}
```

## TypeScript 体验

工具函数会尽量从输入推导类型，不要求你手动传泛型。

```ts
import { diffArray, keyBy } from '@zhouchengfeng/okay-core/coll'

const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' },
] as const

const byId = keyBy(users, (user) => user.id)
// Record<PropertyKey, { readonly id: 1 | 2; readonly name: 'Alice' | 'Bob'; readonly role: 'admin' | 'user' }>

const diff = diffArray(users, [{ id: 2, name: 'Bob', role: 'owner' }])
diff.updated[0]?.valueChanged
// boolean | undefined
```

## Vue 使用

`@zhouchengfeng/okay-vue` 面向 Vue 3，返回值遵循 Composition API 的 `Ref` 习惯。

```ts
import { useDebouncedRef, useValidatedRef } from '@zhouchengfeng/okay-vue'

const keyword = useDebouncedRef('', { delay: 300 })

const age = useValidatedRef(18, (value) => value >= 0 && value <= 120)

age.value.value = 30
age.error.value
// ''
```

## React 使用

`@zhouchengfeng/okay-react` 聚焦 ref 工具，不包含 UI 组件。

```tsx
import { composeRefs } from '@zhouchengfeng/okay-react'
import { forwardRef, useRef } from 'react'

const Input = forwardRef<HTMLInputElement>((props, forwardedRef) => {
  const localRef = useRef<HTMLInputElement>(null)
  const ref = composeRefs(localRef, forwardedRef)

  return <input {...props} ref={ref} />
})
```

## 常用入口

| 目标                             | 推荐文档                     |
| -------------------------------- | ---------------------------- |
| 判断值类型、收窄 unknown         | [类型判断](/core/is)         |
| 格式化数字、货币、百分比         | [数字](/core/number)         |
| 日期范围、周/月/季度、相对时间   | [日期](/core/date)           |
| 手机号、邮箱、银行卡等脱敏       | [字符串](/core/string)       |
| 文件名、MIME、Blob 读取          | [文件](/core/file)           |
| 数组差异、树遍历和树差异         | [集合与树](/core/collection) |
| Promise 超时、重试、并发和批处理 | [异步控制](/core/async)      |
| Vue ref 工具                     | [Vue](/vue/)                 |
| React ref 工具                   | [React](/react/)             |

## 发布形态

Okay 的包面向现代构建工具发布，默认使用 ESM 和 TypeScript 类型声明。

```ts
import { formatNumber } from '@zhouchengfeng/okay-core/number'
```

避免从内部路径导入未公开文件。公开 API 以根入口和 `@zhouchengfeng/okay-core/async`、`@zhouchengfeng/okay-core/number` 这类子路径入口为准。

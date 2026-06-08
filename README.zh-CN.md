# okay

[English](./README.md) | 简体中文

[在线文档](https://yibird.github.io/okay/)

`okay` 是一个基于 pnpm workspace 的 TypeScript 工具库 monorepo，当前包含三个包：

- `@zhouchengfeng/okay-core`：与框架无关的类型判断、异步控制、数字、文件、日期、数组和树工具。
- `@zhouchengfeng/okay-vue`：Vue 3 composables 和 ref 工具。
- `@zhouchengfeng/okay-react`：React ref 工具。

## 安装

```bash
pnpm add @zhouchengfeng/okay-core
pnpm add @zhouchengfeng/okay-vue
pnpm add @zhouchengfeng/okay-react
```

按需导入：

```ts
import { asyncTo, deferred } from '@zhouchengfeng/okay-core/async'
import { leaves } from '@zhouchengfeng/okay-core/coll'
import { formatBytes } from '@zhouchengfeng/okay-core/file'
import { isEmpty } from '@zhouchengfeng/okay-core/is'
import { formatCurrency } from '@zhouchengfeng/okay-core/number'
import { useDebouncedRef } from '@zhouchengfeng/okay-vue'
import { composeRefs } from '@zhouchengfeng/okay-react'
```

根入口 `@zhouchengfeng/okay-core` 仍然可用，但推荐在对体积敏感的场景使用子路径导入。

## 模块

### @zhouchengfeng/okay-core

类型判断：

| API                                                                                           | 说明                                            |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `rawType(value)`                                                                              | 返回 `Object.prototype.toString` 的原生类型名。 |
| `isArray`, `isBool`, `isString`, `isNumber`, `isBigint`, `isSymbol`                           | 基础类型和数组判断。                            |
| `isObject`, `isFunc`, `isPromise`, `isDate`, `isRegExp`                                       | 对象、函数、Promise 和内置对象判断。            |
| `isMap`, `isSet`, `isWeakMap`, `isWeakSet`                                                    | 集合类型判断。                                  |
| `isDefined`, `isUndefined`, `isNull`, `isNotNull`, `isNil`, `isNullAndUndef`, `isNullOrUndef` | 空值和 undefined 判断。                         |
| `isNaN`, `isFinite`, `isNaNOrFinite`, `isEmpty`, `isBrowser`, `isWindow`, `isElement`         | 常用运行时判断。                                |

异步工具：

| API                                               | 说明                                                            |
| ------------------------------------------------- | --------------------------------------------------------------- |
| `asyncTo(promise, callback?)`                     | 将 Promise 转成 `[error, null]` 或 `[null, value]`。            |
| `abortable(promise)`                              | 返回 `{ promise, abort }`，取消操作幂等，并支持自定义取消原因。 |
| `deferred()`                                      | 创建一个暴露 `resolve` 和 `reject` 的 Promise。                 |
| `parallel(tasks, concurrency)`                    | 按并发上限执行异步任务，并保持结果顺序。                        |
| `settleObject(object)`                            | 以对象形态执行 Promise，并保留 key 和 `PromiseSettledResult`。  |
| `raceObject(object)`                              | 以对象形态竞速 Promise，并返回胜出的 key 和 resolved value。    |
| `withTimeout(promise, timeoutMs, timeoutError?)`  | Promise 超时后 reject。                                         |
| `retry(fn, maxRetryCount?, delay?, shouldRetry?)` | 非递归重试失败的异步函数。                                      |
| `singleFlight(fn)`                                | 多次并发调用共享同一个进行中的 Promise。                        |
| `withSignal(promise, signal?)`                    | 监听 `AbortSignal`，完成后自动移除监听器。                      |

数字工具：

| API                                    | 说明                                                      |
| -------------------------------------- | --------------------------------------------------------- |
| `formatNumber(value, options?)`        | 使用缓存的 `Intl.NumberFormat` 格式化普通数字。           |
| `formatPercent(value, options?)`       | 将 ratio 或已经是百分比的数值格式化为本地化百分比。       |
| `formatCurrency(value, options?)`      | 格式化货币，支持 options 对象和 currency 字符串快捷参数。 |
| `formatCompactNumber(value, options?)` | 格式化紧凑数字，例如 `1.2K` 或本地化长文本。              |
| `createNumberFormatter(options?)`      | 创建可复用 formatter，适合表格、循环等高频格式化场景。    |

文件工具：

| API                                  | 说明                                                      |
| ------------------------------------ | --------------------------------------------------------- |
| `fileExt(fileName, withDot?)`        | 获取小写文件扩展名，并忽略路径、查询参数和 hash。         |
| `fileParts(fileName)`                | 将文件路径或文件名拆成 `baseName`、`name`、`extension`。  |
| `formatBytes(bytes, options?)`       | 使用二进制或十进制单位格式化文件大小。                    |
| `fileInfo(file, options?)`           | 格式化类文件对象的名称、扩展名、MIME 类型和大小文案。     |
| `readText`, `readBuffer`, `readJson` | 使用现代 API 读取 `Blob`，并兼容 `FileReader` 兜底。      |
| `blobBase64(blob)`, `dataUrl(blob)`  | 不依赖 Node-only API，将 `Blob` 转为 base64 或 Data URL。 |
| `blobText(blob)`                     | 读取 Blob 文本。                                          |

集合工具：

| API                                                                | 说明                             |
| ------------------------------------------------------------------ | -------------------------------- |
| `keyBy`, `diffArray`, `fastIndexedMap`, `fastStableSort`, `listToTree` | 数组工具。                       |
| `forEachTree`                                                      | 树遍历工具，支持前序和后序模式。 |
| `findNode`, `findParent`, `findPath`                               | 树查询工具。                     |
| `depth`, `firstLeafPath`, `lastLeafPath`, `leaves`                 | 树结构信息工具。                 |
| `mapTree`, `treeToList`, `treeToSet`                               | 树转换工具。                     |

日期工具：

| API                                                              | 说明                                                        |
| ---------------------------------------------------------------- | ----------------------------------------------------------- |
| `format`, `formatDate`, `formatDateTime`, `formatTime`           | 使用 Day.js 模板格式化日期、日期时间和时间。                |
| `formatRange`, `dateRange`, `dateTimeRange`, `timeRange`         | 格式化单个日期或日期范围。                                  |
| `relativeTime(date, options?)`                                   | 使用缓存的 `Intl.RelativeTimeFormat` 格式化本地化相对时间。 |
| `isSameDay(dateA, dateB?)`                                       | 判断两个有效日期是否是同一个自然日。                        |
| `isBusinessDay(date, options?)`                                  | 按可配置周末和节假日判断是否工作日。                        |
| `businessDays(start, end, options?)`                             | 计算日期区间内的工作日天数，避免逐日遍历。                  |
| `isoWeek`, `weekOfYear`, `weeksOfMonth`, `quarter`, `isLeapYear` | 周、月、季度和年份相关工具。                                |

### @zhouchengfeng/okay-vue

| API                                       | 说明                                                          |
| ----------------------------------------- | ------------------------------------------------------------- |
| `useDebouncedValue(source, delay?)`       | 返回一个延迟跟随 source ref 的 ref。                          |
| `useDebouncedRef(initialValue, options?)` | 创建可写的防抖 ref。                                          |
| `useThrottledRef(initialValue, options?)` | 创建可写的节流 ref，支持 `leading` 和 `trailing`。            |
| `useSyncedRef(source)`                    | 将 source ref 同步到一个新的 ref。                            |
| `useValidatedRef(initial, validator)`     | 返回 `{ value, error }`，用于简单校验状态。                   |
| `useStorageRef` / `useCachedRef`          | 将 ref 持久化到 `StorageLike`，并提供 `sync()` / `remove()`。 |

### @zhouchengfeng/okay-react

| API                        | 说明                                               |
| -------------------------- | -------------------------------------------------- |
| `setRef(ref, value)`       | 写入对象 ref 或 callback ref。                     |
| `composeRefs(...refs)`     | 将多个 ref 合并成一个 callback ref。               |
| `isRef(value)`             | 判断一个值是否是 React ref object。                |
| `getRefValue(value)`       | 如果传入 ref，则返回 `ref.current`，否则返回原值。 |
| `withForwardedRef(render)` | `React.forwardRef` 的轻量封装。                    |

## 开发

仓库使用 pnpm workspaces，并只保留一个锁文件：`pnpm-lock.yaml`。

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm lint
pnpm format
pnpm format:check
pnpm test:unit
pnpm test:bench
```

工程化工具：

- 代码检查：`oxlint`
- 代码格式化：`oxfmt`
- 构建：`tsdown`
- 单元测试：`vitest`
- 性能测试：`mitata`
- 发布：`changesets`

## 性能测试

性能测试使用 `mitata`，集中维护在 `scripts/bench.ts`。目前覆盖异步工具、日期工具、数字工具、文件工具、类型判断和树工具。运行方式：

```bash
pnpm test:bench
```

## 许可证

[MIT](./LICENSE)

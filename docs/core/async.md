# 异步控制

异步工具覆盖 Promise 结果包装、并发控制、超时、取消、重试、对象化竞态、请求合并、批处理和长任务切片。它们不依赖框架，适合在 Node.js、浏览器和框架业务层复用。

```ts
import {
  abortable,
  asyncTo,
  batchSync,
  deferred,
  parallel,
  raceObject,
  retry,
  settleObject,
  singleFlight,
  timeSlice,
  withSignal,
  withTimeout,
  type Abortable,
  type AsyncTask,
  type Awaitable,
  type BatchSyncOptions,
  type BatchSyncRunner,
  type Deferred,
  type RaceObjectResult,
  type SettledObjectResult,
  type TimeSliceGeneratorFn,
} from '@okay/core'
```

## API 总览

| 方法           | 类型签名                                                                                                                                             | 示例                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `asyncTo`      | `<T, E = Error>(promise: Promise<T>, callback?: () => void) => Promise<[E, null] \| [null, T]>`                                                      | `const [err, data] = await asyncTo(fetchUser())`    |
| `abortable`    | `<T>(promise: Promise<T>) => Abortable<T>`                                                                                                           | `const task = abortable(fetchUser()); task.abort()` |
| `deferred`     | `<T = void, E = unknown>() => Deferred<T, E>`                                                                                                        | `const ready = deferred<void>()`                    |
| `parallel`     | `<T>(tasks: Array<AsyncTask<T>>, concurrency?: number) => Promise<T[]>`                                                                              | `await parallel(tasks, 4)`                          |
| `settleObject` | `<T extends PromiseObject>(object: T) => Promise<SettledObjectResult<T>>`                                                                            | `await settleObject({ user, order })`               |
| `raceObject`   | `<T extends PromiseObject>(object: T) => Promise<RaceObjectResult<T>>`                                                                               | `await raceObject({ cache, network })`              |
| `withTimeout`  | `<T>(promise: Promise<T>, timeoutMs: number, timeoutError?: Error) => Promise<T>`                                                                    | `await withTimeout(fetchUser(), 3000)`              |
| `withSignal`   | `<T>(promise: Promise<T>, signal?: AbortSignal) => Promise<T>`                                                                                       | `await withSignal(fetchUser(), controller.signal)`  |
| `retry`        | `<T, E = unknown>(fn: () => Promise<T>, maxRetryCount?: number, delay?: number, shouldRetry?: (error: E, attempt: number) => boolean) => Promise<T>` | `await retry(load, 3, 200)`                         |
| `singleFlight` | `<Args extends unknown[], Result>(fn: (...args: Args) => Promise<Result>) => (...args: Args) => Promise<Result>`                                     | `const loadOnce = singleFlight(load)`               |
| `batchSync`    | `<T>(callback: (items: readonly T[]) => void, options?: BatchSyncOptions<T>) => BatchSyncRunner<T>`                                                  | `const push = batchSync(saveRows)`                  |
| `timeSlice`    | `<TReturn = void>(fn: TimeSliceGeneratorFn<TReturn>, maxFrameTime?: number) => Promise<TReturn>`                                                     | `await timeSlice(function* () { yield })`           |

## asyncTo

把异常转换成错误优先元组，减少业务层 `try/catch` 嵌套。

```ts
const [error, user] = await asyncTo(fetchUser('u1'))

if (error) {
  report(error)
} else {
  render(user)
}
```

## abortable

`abortable` 不会取消底层异步操作，只会让包装后的 promise 提前拒绝。

```ts
const task = abortable(fetch('/api/profile').then((res) => res.json()))

setTimeout(() => {
  task.abort(new Error('用户离开页面'))
}, 1000)

await task.promise
```

## deferred

适合需要跨回调或跨作用域完成 Promise 的场景。

```ts
const ready = deferred<void>()

window.addEventListener('load', () => {
  ready.resolve()
})

await ready.promise
```

## parallel

限制并发数，同时保持结果顺序与输入任务顺序一致。

```ts
const tasks: Array<AsyncTask<User>> = ids.map((id) => () => fetchUser(id))

const users = await parallel(tasks, 4)
// users[0] 对应 ids[0]
```

## settleObject

对象版 `Promise.allSettled`，保留输入对象的 key。

```ts
const result = await settleObject({
  profile: fetchProfile(),
  settings: fetchSettings(),
})

if (result.profile.status === 'fulfilled') {
  result.profile.value
}
```

## raceObject

对象版 `Promise.race`，返回最先完成的 key 和 value。

```ts
const fastest = await raceObject({
  cache: readCache(),
  network: fetchRemote(),
})

fastest.key
// 'cache' | 'network'
```

## withTimeout

给任意 Promise 添加超时保护。

```ts
await withTimeout(fetch('/api/report'), 5000, new Error('报表加载超时'))
```

## withSignal

让 Promise 响应 `AbortSignal`。如果没有传入 signal，会直接返回原 promise。

```ts
const controller = new AbortController()

const request = withSignal(fetchUser(), controller.signal)

controller.abort('route changed')

await request
```

## retry

`maxRetryCount` 是失败后的额外重试次数，`3` 表示最多执行 4 次。

```ts
const profile = await retry(
  () => fetchProfile(),
  3,
  200,
  (error: { status?: number }) => error.status !== 404,
)
```

## singleFlight

并发期间复用同一个进行中的 Promise，适合用户信息、配置、权限等重复请求合并。

```ts
const loadCurrentUser = singleFlight(async () => {
  const response = await fetch('/api/me')
  return response.json() as Promise<User>
})

await Promise.all([loadCurrentUser(), loadCurrentUser(), loadCurrentUser()])
// 实际只会触发一次 fetch
```

## batchSync

把高频同步推送合并到一个批次，可去重、合并、排序。

```ts
const syncRows = batchSync(
  (rows: readonly Row[]) => {
    patchTable(rows)
  },
  {
    key: (row) => row.id,
    merge: (previous, next) => ({ ...previous, ...next }),
    scheduler: 'microtask',
    sort: (left, right) => left.id - right.id,
  },
)

syncRows({ id: 1, name: 'old' })
syncRows({ id: 1, name: 'new' })

syncRows.flush()
```

## timeSlice

把长同步任务拆成多个时间片。每次 `yield` 都是可暂停检查点。

```ts
await timeSlice(function* () {
  for (const item of largeList) {
    normalize(item)
    yield
  }
}, 8)
```

## 类型

```ts
type Awaitable<T> = T | PromiseLike<T>
type AsyncTask<T> = () => Promise<T>
type TimeSliceGeneratorFn<TReturn = void> = () => Generator<unknown, TReturn, unknown>

interface Deferred<T, E = unknown> {
  promise: Promise<T>
  resolve(value: T | PromiseLike<T>): void
  reject(reason?: E): void
}

interface Abortable<T> {
  promise: Promise<T>
  abort(reason?: unknown): void
}
```

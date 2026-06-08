# 类型判断

类型判断工具提供运行时检查和 TypeScript 类型收窄。大多数方法是 `target is ...` 类型守卫，可以直接用于 `if` 分支、`Array.prototype.filter` 和输入校验。

```ts
import {
  isArray,
  isBigint,
  isBool,
  isBrowser,
  isDate,
  isDefined,
  isElement,
  isEmpty,
  isFinite,
  isFunc,
  isMap,
  isNaN,
  isNaNOrFinite,
  isNil,
  isNotNull,
  isNull,
  isNullAndUndef,
  isNullOrUndef,
  isNumber,
  isObject,
  isPromise,
  isRegExp,
  isSet,
  isString,
  isSymbol,
  isUndefined,
  isWeakMap,
  isWeakSet,
  isWindow,
  rawType,
} from '@zhouchengfeng/okay-core'
```

## API 总览

| 方法             | 类型签名                                                                        | 示例                                |
| ---------------- | ------------------------------------------------------------------------------- | ----------------------------------- | ---------------------- |
| `rawType`        | `(target: unknown) => string`                                                   | `rawType(new Map()) // 'Map'`       |
| `isArray`        | `<T = any>(target: unknown) => target is T[]`                                   | `isArray<number>(value)`            |
| `isString`       | `(target: unknown) => target is string`                                         | `if (isString(value)) value.trim()` |
| `isNumber`       | `(target: unknown) => target is number`                                         | `isNumber(1) // true`               |
| `isBool`         | `(target: unknown) => target is boolean`                                        | `isBool(false) // true`             |
| `isBigint`       | `(target: unknown) => target is bigint`                                         | `isBigint(1n) // true`              |
| `isSymbol`       | `(target: unknown) => target is symbol`                                         | `isSymbol(Symbol.iterator) // true` |
| `isObject`       | `(target: unknown) => target is Record<PropertyKey, unknown>`                   | `isObject({ id: 1 }) // true`       |
| `isFunc`         | `<T extends (...args: any[]) => any>(target: unknown) => target is T`           | `if (isFunc(fn)) fn()`              |
| `isPromise`      | `<T = any>(target: unknown) => target is Promise<T>`                            | `isPromise(fetch('/'))`             |
| `isDate`         | `(target: unknown) => target is Date`                                           | `isDate(new Date()) // true`        |
| `isRegExp`       | `(target: unknown) => target is RegExp`                                         | `isRegExp(/ok/) // true`            |
| `isMap`          | `<K = any, V = any>(target: unknown) => target is Map<K, V>`                    | `isMap<string, number>(value)`      |
| `isSet`          | `<T = any>(target: unknown) => target is Set<T>`                                | `isSet(new Set()) // true`          |
| `isWeakMap`      | `<K extends object = any, V = any>(target: unknown) => target is WeakMap<K, V>` | `isWeakMap(new WeakMap())`          |
| `isWeakSet`      | `<T extends object = any>(target: unknown) => target is WeakSet<T>`             | `isWeakSet(new WeakSet())`          |
| `isDefined`      | `<T>(target: T) => target is Exclude<T, undefined>`                             | `[1, undefined].filter(isDefined)`  |
| `isUndefined`    | `(target?: unknown) => target is undefined`                                     | `isUndefined(value)`                |
| `isNull`         | `(target: unknown) => target is null`                                           | `isNull(null) // true`              |
| `isNotNull`      | `<T>(target: T) => target is Exclude<T, null>`                                  | `[1, null].filter(isNotNull)`       |
| `isNil`          | `(target: unknown) => target is null                                            | undefined`                          | `isNil(value)`         |
| `isNullOrUndef`  | `(target: unknown) => target is null                                            | undefined`                          | `isNullOrUndef(value)` |
| `isNullAndUndef` | `(_target: unknown) => _target is never`                                        | `isNullAndUndef(value) // false`    |
| `isNaN`          | `(value: unknown) => value is number`                                           | `isNaN(Number.NaN)`                 |
| `isFinite`       | `(target: unknown) => target is number`                                         | `isFinite(1)`                       |
| `isNaNOrFinite`  | `(target: unknown) => target is number`                                         | `isNaNOrFinite(Number.NaN)`         |
| `isBrowser`      | `() => boolean`                                                                 | `if (isBrowser()) localStorage`     |
| `isWindow`       | `(target: unknown) => target is Window`                                         | `isWindow(window)`                  |
| `isElement`      | `(target: unknown) => target is Element`                                        | `isElement(document.body)`          |
| `isEmpty`        | `(target: unknown) => boolean`                                                  | `isEmpty([]) // true`               |

## 类型收窄

```ts
function normalize(value: unknown) {
  if (isString(value)) {
    return value.trim()
  }

  if (isNumber(value)) {
    return String(value)
  }

  return ''
}
```

## filter 场景

```ts
const values: Array<number | undefined | null> = [1, undefined, 2, null]

const definedValues = values.filter(isDefined)
// Array<number | null>

const numbers = values.filter(isNotNull).filter(isDefined)
// number[]

const compact = values.filter((value) => !isNil(value))
// number[]
```

## 集合和对象判断

```ts
function readCache(value: unknown) {
  if (isMap<string, number>(value)) {
    return value.get('count')
  }

  if (isObject(value)) {
    return value['count']
  }

  return undefined
}
```

## 运行环境判断

```ts
if (isBrowser()) {
  window.document.title = 'Okay'
}

const maybeElement: unknown = document.querySelector('#app')

if (isElement(maybeElement)) {
  maybeElement.setAttribute('data-ready', 'true')
}
```

## 空值判断的区别

| 方法             | `null`  | `undefined` | 适用场景                                              |
| ---------------- | ------- | ----------- | ----------------------------------------------------- |
| `isDefined`      | `true`  | `false`     | 只排除 `undefined`                                    |
| `isUndefined`    | `false` | `true`      | 判断未定义                                            |
| `isNull`         | `true`  | `false`     | 判断显式空对象                                        |
| `isNotNull`      | `false` | `true`      | 只排除 `null`                                         |
| `isNil`          | `true`  | `true`      | 同时排除 `null` 和 `undefined`                        |
| `isNullOrUndef`  | `true`  | `true`      | `isNil` 的语义等价方法                                |
| `isNullAndUndef` | `false` | `false`     | JavaScript 值不可能同时为二者，保留用于非常规兼容判断 |

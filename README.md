# okay

English | [简体中文](./README.zh-CN.md)

<a href="https://yibird.github.io/okay/" target="_blank" rel="noopener noreferrer">Documentation</a>

`okay` is a pnpm monorepo for small, typed utilities. It publishes three packages:

- `@zhouchengfeng/okay-core`: framework-agnostic utilities for type checks, async control, numbers, files, dates, arrays, and trees.
- `@zhouchengfeng/okay-vue`: Vue 3 composables and ref helpers.
- `@zhouchengfeng/okay-react`: React ref helpers.

## Installation

```bash
pnpm add @zhouchengfeng/okay-core
pnpm add @zhouchengfeng/okay-vue
pnpm add @zhouchengfeng/okay-react
```

Use the package you need:

```ts
import { asyncTo, deferred } from '@zhouchengfeng/okay-core/async'
import { leaves } from '@zhouchengfeng/okay-core/coll'
import { formatBytes } from '@zhouchengfeng/okay-core/file'
import { isEmpty } from '@zhouchengfeng/okay-core/is'
import { formatCurrency } from '@zhouchengfeng/okay-core/number'
import { useDebouncedRef } from '@zhouchengfeng/okay-vue'
import { composeRefs } from '@zhouchengfeng/okay-react'
```

The root entry `@zhouchengfeng/okay-core` is still available, but subpath imports keep non-bundled runtimes smaller.

## Packages

### @zhouchengfeng/okay-core

Type guards:

| API                                                                                           | Description                                               |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `rawType(value)`                                                                              | Returns the native `Object.prototype.toString` type name. |
| `isArray`, `isBool`, `isString`, `isNumber`, `isBigint`, `isSymbol`                           | Primitive and array checks.                               |
| `isObject`, `isFunc`, `isPromise`, `isDate`, `isRegExp`                                       | Object and callable checks.                               |
| `isMap`, `isSet`, `isWeakMap`, `isWeakSet`                                                    | Collection checks.                                        |
| `isDefined`, `isUndefined`, `isNull`, `isNotNull`, `isNil`, `isNullAndUndef`, `isNullOrUndef` | Nullish checks.                                           |
| `isNaN`, `isFinite`, `isNaNOrFinite`, `isEmpty`, `isBrowser`, `isWindow`, `isElement`         | Common runtime checks.                                    |

Async utilities:

| API                                               | Description                                                                     |
| ------------------------------------------------- | ------------------------------------------------------------------------------- |
| `asyncTo(promise, callback?)`                     | Converts a promise into `[error, null]` or `[null, value]`.                     |
| `abortable(promise)`                              | Returns `{ promise, abort }`; abort is idempotent and supports a custom reason. |
| `deferred()`                                      | Creates a promise with exposed `resolve` and `reject` functions.                |
| `parallel(tasks, concurrency)`                    | Runs async tasks with a concurrency limit and keeps result order.               |
| `settleObject(object)`                            | Runs object-shaped promises and preserves keys with `PromiseSettledResult`.     |
| `raceObject(object)`                              | Races object-shaped promises and returns the winning key with its value.        |
| `withTimeout(promise, timeoutMs, timeoutError?)`  | Rejects when a promise exceeds the timeout.                                     |
| `retry(fn, maxRetryCount?, delay?, shouldRetry?)` | Retries a failing async function without recursive calls.                       |
| `singleFlight(fn)`                                | Shares one in-flight promise across concurrent calls.                           |
| `withSignal(promise, signal?)`                    | Rejects on abort and removes listeners after settlement.                        |

Number utilities:

| API                                    | Description                                                                   |
| -------------------------------------- | ----------------------------------------------------------------------------- |
| `formatNumber(value, options?)`        | Formats decimal numbers with cached `Intl.NumberFormat` instances.            |
| `formatPercent(value, options?)`       | Formats ratios or already-percent values as localized percentages.            |
| `formatCurrency(value, options?)`      | Formats currency values; supports both options object and currency shorthand. |
| `formatCompactNumber(value, options?)` | Formats compact notation such as `1.2K` or localized long compact labels.     |
| `createNumberFormatter(options?)`      | Creates a reusable formatter for hot paths such as tables and loops.          |

File utilities:

| API                                  | Description                                                                       |
| ------------------------------------ | --------------------------------------------------------------------------------- |
| `fileExt(fileName, withDot?)`        | Gets a lowercase file extension while ignoring paths, query strings, and hashes.  |
| `fileParts(fileName)`                | Splits a file path or name into `baseName`, `name`, and `extension`.              |
| `formatBytes(bytes, options?)`       | Formats byte counts with binary or decimal units.                                 |
| `fileInfo(file, options?)`           | Formats file-like metadata with parsed name, extension, MIME type, and size text. |
| `readText`, `readBuffer`, `readJson` | Reads `Blob` values with modern APIs and `FileReader` fallback.                   |
| `blobBase64(blob)`, `dataUrl(blob)`  | Converts `Blob` values into base64 strings or data URLs without Node-only APIs.   |
| `blobText(blob)`                     | Reads Blob text.                                                                  |

Collections:

| API                                                                | Description                                                |
| ------------------------------------------------------------------ | ---------------------------------------------------------- |
| `keyBy`, `diffArray`, `fastIndexedMap`, `fastStableSort`, `listToTree` | Array helpers.                                             |
| `forEachTree`                                                      | Tree traversal helper with pre-order and post-order modes. |
| `findNode`, `findParent`, `findPath`                               | Tree lookup helpers.                                       |
| `depth`, `firstLeafPath`, `lastLeafPath`, `leaves`                 | Tree shape helpers.                                        |
| `mapTree`, `treeToList`, `treeToSet`                               | Tree transformation helpers.                               |

Date utilities:

| API                                                              | Description                                                            |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `format`, `formatDate`, `formatDateTime`, `formatTime`           | Formats dates, datetimes, and times with Day.js templates.             |
| `formatRange`, `dateRange`, `dateTimeRange`, `timeRange`         | Formats single dates or date ranges.                                   |
| `relativeTime(date, options?)`                                   | Formats localized relative time with cached `Intl.RelativeTimeFormat`. |
| `isSameDay(dateA, dateB?)`                                       | Checks whether two valid dates fall on the same calendar day.          |
| `isBusinessDay(date, options?)`                                  | Checks weekdays with configurable weekends and holidays.               |
| `businessDays(start, end, options?)`                             | Counts business days across a range without per-day iteration.         |
| `isoWeek`, `weekOfYear`, `weeksOfMonth`, `quarter`, `isLeapYear` | Week, month, quarter, and year helpers.                                |

### @zhouchengfeng/okay-vue

| API                                       | Description                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------------ |
| `useDebouncedValue(source, delay?)`       | Returns a ref that follows another ref after a debounce delay.                 |
| `useDebouncedRef(initialValue, options?)` | Creates a debounced writable ref.                                              |
| `useThrottledRef(initialValue, options?)` | Creates a throttled writable ref with `leading` and `trailing` options.        |
| `useSyncedRef(source)`                    | Mirrors a source ref into a new ref.                                           |
| `useValidatedRef(initial, validator)`     | Returns `{ value, error }` for validated state.                                |
| `useStorageRef` / `useCachedRef`          | Persists a ref into a `StorageLike` object and supports `sync()` / `remove()`. |

### @zhouchengfeng/okay-react

| API                        | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `setRef(ref, value)`       | Writes a value to object or callback refs.               |
| `composeRefs(...refs)`     | Combines multiple refs into one callback ref.            |
| `isRef(value)`             | Checks whether a value is a React ref object.            |
| `getRefValue(value)`       | Returns `ref.current` for refs, otherwise the raw value. |
| `withForwardedRef(render)` | Small `React.forwardRef` wrapper.                        |

## Development

This repository uses pnpm workspaces and keeps one lockfile: `pnpm-lock.yaml`.

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

Engineering tooling:

- Lint: `oxlint`
- Format: `oxfmt`
- Build: `tsdown`
- Unit tests: `vitest`
- Benchmarks: `mitata`
- Release: `changesets`

## Performance Tests

Benchmarks are implemented with `mitata` in `scripts/bench.ts`. They currently cover async helpers, date helpers, number helpers, file helpers, type guards, and tree utilities. Run them with:

```bash
pnpm test:bench
```

## License

[MIT](./LICENSE)

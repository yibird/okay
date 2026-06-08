/**
 * `fastStableSort` 支持的数字排序键。
 */
export type FastStableSortKey = number

/**
 * 从数据项中提取数字排序键的函数。
 */
export type FastStableSortSelector<T> = (item: T, index?: number) => FastStableSortKey

/**
 * 标准二元比较函数。
 */
export type FastStableSortCompare<T> = (left: T, right: T) => number

/**
 * 排序函数识别模式。
 */
export type FastStableSortMode = 'auto' | 'key' | 'compare'

type FastStableSortCompareOptions = Omit<FastStableSortOptions, 'maxBucketSize' | 'maxKey'> & {
  mode?: 'auto' | 'compare'
}

type FastStableSortKeyOptions = FastStableSortOptions & {
  mode?: 'auto' | 'key'
}

/**
 * 稳定排序配置。
 */
export interface FastStableSortOptions {
  /**
   * 排序函数识别模式。
   *
   * `auto` 会把一参数函数识别为排序键选择器，把二参数函数识别为标准 compare 函数。
   * 如果键选择器需要使用 index 参数，请显式传入 `key`。
   */
  mode?: FastStableSortMode
  /**
   * 可进入计数排序路径的最大整数键。
   *
   * 默认值为 `64`，适合状态、优先级、分组权重等低基数业务字段。
   */
  maxKey?: number
  /**
   * 允许创建的最大桶数量。
   *
   * 当实际键空间超过该值时会回退到稳定比较排序，避免误传超大 `maxKey` 导致内存浪费。
   */
  maxBucketSize?: number
}

type KeySortOptions = Required<Pick<FastStableSortOptions, 'maxBucketSize' | 'maxKey'>>

const DEFAULT_MAX_KEY = 64
const DEFAULT_BUCKET_RATIO = 4

const isSmallIntegerKey = (key: number, maxKey: number) =>
  Number.isInteger(key) && key >= 0 && key <= maxKey

const isFiniteSortKey = (key: number) => typeof key === 'number' && Number.isFinite(key)

const normalizeMaxKey = (maxKey: number | undefined) => {
  const resolved = maxKey ?? DEFAULT_MAX_KEY

  if (!Number.isFinite(resolved) || resolved < 0) {
    throw new TypeError('maxKey 必须是大于或等于 0 的有限数字')
  }

  return Math.floor(resolved)
}

const normalizeMaxBucketSize = (maxBucketSize: number | undefined, length: number) => {
  const resolved = maxBucketSize ?? Math.max(DEFAULT_MAX_KEY + 1, length * DEFAULT_BUCKET_RATIO)

  if (!Number.isFinite(resolved) || resolved < 1) {
    throw new TypeError('maxBucketSize 必须是大于 0 的有限数字')
  }

  return Math.floor(resolved)
}

const findMatchingParen = (source: string, startIndex: number) => {
  let depth = 0
  let quote: string | undefined

  for (let index = startIndex; index < source.length; index++) {
    const char = source[index]
    const previous = source[index - 1]

    if (quote !== undefined) {
      if (char === quote && previous !== '\\') {
        quote = undefined
      }
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }

    if (char === '(') {
      depth++
      continue
    }

    if (char === ')') {
      depth--
      if (depth === 0) return index
    }
  }

  return -1
}

const countParameters = (parameters: string) => {
  const trimmed = parameters.trim()
  if (trimmed === '') return 0

  let count = 1
  let depth = 0
  let quote: string | undefined

  for (let index = 0; index < trimmed.length; index++) {
    const char = trimmed[index]
    const previous = trimmed[index - 1]

    if (quote !== undefined) {
      if (char === quote && previous !== '\\') {
        quote = undefined
      }
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }

    if (char === '(' || char === '[' || char === '{') {
      depth++
      continue
    }

    if (char === ')' || char === ']' || char === '}') {
      depth--
      continue
    }

    if (char === ',' && depth === 0) {
      count++
    }
  }

  return count
}

// Cache parsed parameter metadata to avoid repeated toString() + string scanning per call.
const fnParamCache = new WeakMap<Function, { count: number; hasRest: boolean }>()

const parseFnParams = (fn: Function): { count: number; hasRest: boolean } => {
  const cached = fnParamCache.get(fn)
  if (cached) return cached

  const source = Function.prototype.toString.call(fn).trim()
  const arrowIndex = source.indexOf('=>')

  let count: number
  let hasRest: boolean

  if (arrowIndex !== -1) {
    // Arrow function: everything before => is the parameter list.
    const beforeArrow = source.slice(0, arrowIndex).trim()
    if (beforeArrow.startsWith('(')) {
      const endIndex = findMatchingParen(beforeArrow, 0)
      const paramList = endIndex === -1 ? beforeArrow.slice(1) : beforeArrow.slice(1, endIndex)
      count = endIndex === -1 ? fn.length : countParameters(paramList)
      hasRest = paramList.trimStart().startsWith('...')
    } else {
      // Single unparenthesised param, e.g. `x => x`
      /* v8 ignore next 2 */ count = beforeArrow === '' ? 0 : 1
      hasRest = false
    }
  } else {
    // Regular / method / class function: extract param list from between the first ( ).
    const startIndex = source.indexOf('(')
    if (startIndex === -1) {
      /* v8 ignore next 2 */ count = fn.length
      hasRest = false
    } else {
      const endIndex = findMatchingParen(source, startIndex)
      const paramList =
        endIndex === -1 ? source.slice(startIndex + 1) : source.slice(startIndex + 1, endIndex)
      count = endIndex === -1 ? fn.length : countParameters(paramList)
      // Check only the extracted param list, not the function body.
      hasRest = paramList.trimStart().startsWith('...')
    }
  }

  const result = { count, hasRest }
  fnParamCache.set(fn, result)
  return result
}

const getDeclaredParameterCount = (fn: Function) => parseFnParams(fn).count

const hasRestParameter = (fn: Function) => parseFnParams(fn).hasRest

const createSortedIndexes = (
  length: number,
  compareIndex: (left: number, right: number) => number,
) => {
  const indexes = Array.from({ length }, (_, index) => index)

  indexes.sort(compareIndex)

  return indexes
}

const createSortedResult = <T>(array: readonly T[], indexes: readonly number[]) => {
  const result = Array.from<T>({ length: array.length })

  for (let index = 0; index < indexes.length; index++) {
    result[index] = array[indexes[index]]
  }

  return result
}

const stableCompareSort = <T>(array: readonly T[], compareFn: FastStableSortCompare<T>): T[] =>
  createSortedResult(
    array,
    createSortedIndexes(array.length, (left, right) => {
      const result = compareFn(array[left], array[right])

      return result === 0 || Number.isNaN(result) ? left - right : result
    }),
  )

const stableKeySort = <T>(array: readonly T[], keys: readonly number[]): T[] =>
  createSortedResult(
    array,
    createSortedIndexes(array.length, (left, right) => {
      const result = keys[left] - keys[right]

      return result === 0 ? left - right : result
    }),
  )

const countingSortByKey = <T>(
  array: readonly T[],
  keys: readonly number[],
  bucketSize: number,
): T[] => {
  const cursors = Array.from({ length: bucketSize }, () => 0)

  for (const key of keys) {
    cursors[key]++
  }

  let offset = 0
  for (let index = 0; index < cursors.length; index++) {
    const count = cursors[index]
    cursors[index] = offset
    offset += count
  }

  const result = Array.from<T>({ length: array.length })

  for (let index = 0; index < array.length; index++) {
    result[cursors[keys[index]]++] = array[index]
  }

  return result
}

const keySort = <T>(
  array: readonly T[],
  keySelector: FastStableSortSelector<T>,
  options: KeySortOptions,
) => {
  const keys = Array.from<number>({ length: array.length })
  let canUseCountingSort = true
  let maxObservedKey = 0

  for (let index = 0; index < array.length; index++) {
    const key = keySelector(array[index], index)

    if (!isFiniteSortKey(key)) {
      throw new TypeError('fastStableSort 的排序键必须是有限数字')
    }

    keys[index] = key

    if (!isSmallIntegerKey(key, options.maxKey)) {
      canUseCountingSort = false
      continue
    }

    if (key > maxObservedKey) {
      maxObservedKey = key
    }
  }

  const bucketSize = maxObservedKey + 1

  return canUseCountingSort && bucketSize <= options.maxBucketSize
    ? countingSortByKey(array, keys, bucketSize)
    : stableKeySort(array, keys)
}

const shouldUseKeySort = <T>(
  sortFn: FastStableSortSelector<T> | FastStableSortCompare<T>,
  options: FastStableSortOptions,
) => {
  if (options.mode === 'key') return true
  if (options.mode === 'compare') return false
  if (options.maxKey !== undefined || options.maxBucketSize !== undefined) return true

  // fn.length is the primary signal: 2+ declared params → compare function.
  if (sortFn.length >= 2) return false

  // Rest-parameter functions have fn.length === 0 but behave as compare functions.
  // Source parsing is the only way to detect them; wrap in try/catch for Proxy/native safety.
  try {
    if (hasRestParameter(sortFn)) return false
    return getDeclaredParameterCount(sortFn) <= 1
  } catch {
    // toString() unavailable — fn.length === 0 or 1 is ambiguous; default to compare.
    return false
  }
}

/**
 * 对数组执行稳定排序，并针对低基数数字键自动走计数排序快路径。
 *
 * 当排序函数被识别为键选择器，且所有键都是 `0..maxKey` 范围内的小整数时，会使用稳定计数排序，
 * 复杂度为 `O(n + k)`，特别适合优先级、状态码、权重分流等低基数场景。
 * 当传入标准二元 compare 函数，或键空间不适合创建桶时，会使用稳定比较排序作为兜底。
 *
 * @param array 需要排序的源数组，不会被原地修改。
 * @param sortFn 排序键选择器或标准比较函数。
 * @param options 计数排序快路径配置。
 * @returns 排序后的新数组。
 */
export function fastStableSort<T>(
  array: readonly T[],
  compareFn: FastStableSortCompare<T>,
  options?: FastStableSortCompareOptions,
): T[]
export function fastStableSort<T>(
  array: readonly T[],
  keySelector: FastStableSortSelector<T>,
  options?: FastStableSortKeyOptions,
): T[]
export function fastStableSort<T>(
  array: readonly T[],
  sortFn: FastStableSortSelector<T> | FastStableSortCompare<T>,
  options: FastStableSortOptions = {},
): T[] {
  if (shouldUseKeySort(sortFn, options)) {
    const keySortOptions = {
      maxBucketSize: normalizeMaxBucketSize(options.maxBucketSize, array.length),
      maxKey: normalizeMaxKey(options.maxKey),
    }

    if (array.length <= 1) {
      return [...array]
    }

    return keySort(array, sortFn as FastStableSortSelector<T>, keySortOptions)
  }

  if (array.length <= 1) {
    return [...array]
  }

  return stableCompareSort(array, sortFn as FastStableSortCompare<T>)
}

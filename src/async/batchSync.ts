/**
 * 批处理刷新时机。
 */
export type BatchSyncScheduler = 'microtask' | 'raf'

/**
 * `batchSync` 的批处理配置。
 */
export interface BatchSyncOptions<T> {
  /**
   * 批处理触发时机。
   *
   * `microtask` 会在当前微任务周期末尾刷新；`raf` 会在下一帧刷新，更适合合并 UI 更新。
   */
  scheduler?: BatchSyncScheduler
  /**
   * 生成去重键。
   *
   * 未传入时按值本身去重；对象会按引用去重。
   */
  key?: (item: T) => unknown
  /**
   * 合并同一个去重键下的旧值和新值。
   *
   * 未传入时使用“后写覆盖”的策略。
   */
  merge?: (previous: T, next: T) => T
  /**
   * 刷新前对批量数据排序。
   */
  sort?: (left: T, right: T) => number
  /**
   * 外部取消信号。
   */
  signal?: AbortSignal
}

/**
 * `batchSync` 返回的批处理推入函数。
 */
export interface BatchSyncRunner<T> {
  /**
   * 推入一条变更数据。
   */
  (item: T): void
  /**
   * 一次推入多条变更数据。
   */
  push(...items: T[]): void
  /**
   * 立即刷新当前批次。
   */
  flush(): void
  /**
   * 清空当前批次并取消待执行的刷新。
   */
  cancel(): void
  /**
   * 当前批次中去重后的数据量。
   */
  readonly size: number
}

const scheduleMicrotask = (callback: () => void) => {
  // Use native queueMicrotask when available
  if (queueMicrotask) {
    queueMicrotask(callback)
  } else {
    setTimeout(callback, 0)
  }
}

const scheduleFrame = (callback: () => void) => {
  const raf = (
    globalThis as typeof globalThis & {
      requestAnimationFrame?: (cb: FrameRequestCallback) => number
    }
  ).requestAnimationFrame
  if (raf) {
    raf(() => callback())
  } else {
    setTimeout(callback, 16)
  }
}

/**
 * 创建一个自动去重、合并、排序的批量同步函数。
 *
 * 该方法适合 WebSocket 推送、表格联动、画布图元批量更新等高频场景。调用返回函数时只会
 * 暂存变更，真正的回调会在微任务末尾或下一帧统一触发一次。
 *
 * @param callback 批量刷新时执行的回调。
 * @param options 去重键、合并策略、排序策略和调度时机。
 * @returns 可推入数据并手动刷新或取消的批处理函数。
 */
export function batchSync<T>(
  callback: (items: readonly T[]) => void,
  options: BatchSyncOptions<T> = {},
): BatchSyncRunner<T> {
  const cache = new Map<unknown, T>()
  const keyOf = options.key ?? ((item: T) => item)
  const merge = options.merge ?? ((_: T, next: T) => next)
  const scheduler = options.scheduler ?? 'microtask'
  let scheduled = false
  let version = 0

  const flush = () => {
    if (cache.size === 0) {
      /* v8 ignore next 2 */
      scheduled = false
      return
    }

    const items = Array.from(cache.values())
    cache.clear()
    scheduled = false

    if (options.sort) {
      items.sort(options.sort)
    }

    callback(items)
  }

  const cancel = () => {
    version++
    scheduled = false
    cache.clear()
    options.signal?.removeEventListener('abort', cancel)
  }

  const scheduleFlush = () => {
    if (scheduled || options.signal?.aborted) return

    scheduled = true
    const currentVersion = ++version
    const schedule = scheduler === 'raf' ? scheduleFrame : scheduleMicrotask

    schedule(() => {
      if (scheduled && currentVersion === version && !options.signal?.aborted) {
        flush()
      } else {
        scheduled = false
      }
    })
  }

  const push = (...items: T[]) => {
    if (options.signal?.aborted) return

    const len = items.length
    for (let i = 0; i < len; i++) {
      const item = items[i]
      const key = keyOf(item)
      const existing = cache.get(key)
      cache.set(key, existing !== undefined ? merge(existing, item) : item)
    }

    scheduleFlush()
  }

  const runner = ((item: T) => {
    push(item)
  }) as BatchSyncRunner<T>

  runner.push = push
  runner.flush = flush
  runner.cancel = cancel

  Object.defineProperty(runner, 'size', {
    get: () => cache.size,
  })

  options.signal?.addEventListener('abort', cancel, { once: true })

  return runner
}

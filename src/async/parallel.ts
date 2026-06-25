/**
 * 由 `parallel` 执行的异步任务函数。
 */
export type AsyncTask<T> = () => Promise<T>

/**
 * `parallel` 的配置选项。
 */
export interface ParallelOptions {
  /**
   * 外部取消信号。中止后不再调度新任务，已运行中的任务不会被取消。
   */
  signal?: AbortSignal
}

/**
 * 按并发上限执行异步任务，并保持结果顺序与输入顺序一致。
 *
 * 任一任务失败或 signal 中止后会停止继续调度新任务；已经运行中的任务不会被取消，因为原生 Promise 没有内建取消能力。
 *
 * @param tasks 需要执行的任务函数列表。
 * @param concurrency 同时运行的最大任务数量。
 * @param options 可选配置，支持 AbortSignal。
 * @returns 与输入任务顺序一致的结果列表。
 * @throws 第一个失败任务抛出的错误，或 signal 中止时抛出中止错误。
 */
export function parallel<T>(
  tasks: Array<AsyncTask<T>>,
  concurrency = 1,
  options: ParallelOptions = {},
): Promise<T[]> {
  if (!Array.isArray(tasks)) {
    throw new TypeError('tasks must be an array of functions')
  }

  if (tasks.length === 0) return Promise.resolve([])

  const { signal } = options

  if (signal?.aborted) return Promise.reject(signal.reason ?? new Error('Aborted'))

  const limit = Math.min(tasks.length, Math.max(1, Math.floor(concurrency || 1)))
  const results = Array.from<T>({ length: tasks.length })
  let nextIndex = 0
  let completed = 0
  let rejected = false
  let resolved = false

  return new Promise<T[]>((resolve, reject) => {
    const abort = () => {
      /* v8 ignore next */
      if (rejected || resolved) return
      rejected = true
      fail(signal!.reason ?? new Error('Aborted'))
    }

    signal?.addEventListener('abort', abort, { once: true })

    const fail = (error: unknown) => {
      signal?.removeEventListener('abort', abort)
      reject(error)
    }

    const runNext = () => {
      /* v8 ignore next */
      if (rejected) return

      const current = nextIndex++
      /* v8 ignore next */
      if (current >= tasks.length) return

      Promise.resolve()
        .then(tasks[current])
        .then(
          (result) => {
            /* v8 ignore next */
            if (rejected) return
            results[current] = result
            completed++
            if (!resolved && completed === tasks.length) {
              resolved = true
              signal?.removeEventListener('abort', abort)
              resolve(results)
              return
            }
            runNext()
          },
          (error) => {
            rejected = true
            fail(error)
          },
        )
    }

    for (let worker = 0; worker < limit; worker++) {
      runNext()
    }
  })
}

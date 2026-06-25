/**
 * 带有命令式中止函数的 Promise 包装结果。
 */
export interface Abortable<T> {
  /**
   * 包装后的 Promise；如果先调用 `abort`，它会以中止错误拒绝。
   */
  promise: Promise<T>
  /**
   * 使用可选原因拒绝包装后的 Promise。
   */
  abort: (reason?: unknown) => void
}

const createAbortError = (reason?: unknown) =>
  reason instanceof Error ? reason : new Error(String(reason ?? 'Promise aborted'))

/**
 * 将 Promise 包装为可手动中止的任务。
 *
 * 中止操作是幂等的；源 Promise 已经完成后再调用不会产生影响。
 * 该方法不会取消底层异步操作，只会让包装后的 Promise 提前拒绝。
 *
 * @param promise 需要包装的源 Promise。
 * @returns 包装后的 Promise 和中止函数。
 */
export function abortable<T>(promise: Promise<T>): Abortable<T> {
  let settled = false
  let abort!: (reason?: unknown) => void

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    abort = (reason?: unknown) => {
      if (settled) return
      settled = true
      reject(createAbortError(reason))
    }

    promise.then(
      (value) => {
        /* v8 ignore next */
        if (settled) return
        settled = true
        resolve(value)
      },
      (error) => {
        /* v8 ignore next */
        if (settled) return
        settled = true
        reject(error)
      },
    )
  })

  return {
    promise: wrappedPromise,
    abort,
  }
}

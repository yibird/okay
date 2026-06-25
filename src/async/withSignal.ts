const createAbortError = (signal?: AbortSignal) => {
  if (signal?.reason instanceof Error) {
    return signal.reason.message === 'signal is aborted without reason'
      ? new Error('Aborted')
      : signal.reason
  }
  if (signal?.reason !== undefined) return new Error(String(signal.reason))
  /* v8 ignore next */
  return new Error('Aborted')
}

/**
 * 让 Promise 在 `AbortSignal` 中止时同步拒绝。
 *
 * 源 Promise 完成或 signal 中止后都会移除监听器。
 * 该方法不会取消源 Promise 本身，只会让包装后的 Promise 在 signal 触发时拒绝。
 *
 * @param promise 源 Promise。
 * @param signal 可选的中止信号。
 * @returns 未传入 signal 时返回源 Promise，否则返回感知中止的包装 Promise。
 * @throws 源 Promise 错误或中止错误。
 */
export function withSignal<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) return promise
  if (signal.aborted) return Promise.reject(createAbortError(signal))
  return new Promise<T>((resolve, reject) => {
    const cleanup = () => {
      signal.removeEventListener('abort', abort)
    }
    const abort = () => {
      cleanup()
      reject(createAbortError(signal))
    }
    signal.addEventListener('abort', abort, { once: true })
    promise.then(
      (value) => {
        cleanup()
        resolve(value)
      },
      (error) => {
        /* v8 ignore next 2 */
        cleanup()
        reject(error)
      },
    )
  })
}

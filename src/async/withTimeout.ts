/**
 * 在 Promise 超时未完成时拒绝。
 *
 * 源 Promise 不会被取消；当超时先发生时，包装 Promise 只会忽略后续源结果。
 *
 * @param promise 源 Promise。
 * @param timeoutMs 超时时间，单位毫秒。
 * @param timeoutError 超时发生时使用的错误对象。
 * @returns 未超时时跟随源 Promise 完成或拒绝的包装 Promise。
 * @throws 超时先发生时以 `timeoutError` 拒绝。
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutError: Error = new Error('Promise timeout'),
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let settled = false

    const timer = setTimeout(() => {
      /* v8 ignore next */
      if (settled) return
      settled = true
      reject(timeoutError)
    }, timeoutMs)

    promise
      .then((value) => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        resolve(value)
      })
      .catch((error) => {
        /* v8 ignore next */
        if (settled) return
        settled = true
        clearTimeout(timer)
        reject(error)
      })
  })
}

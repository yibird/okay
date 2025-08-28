/**
 * 为 Promise 添加超时控制。泛型T表示Promise的返回值类型
 * @param promise 原始 Promise
 * @param timeoutMs 超时时间,单位为毫秒
 * @param timeoutError 超时错误,默认为 'Promise timeout'
 * @returns 超时控制后的 Promise,超时会抛出 timeoutError
 */
// src/promiseWithTimeout.ts
export function promiseWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutError: Error = new Error('Promise timeout'),
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let settled = false

    const timer = setTimeout(() => {
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
        if (settled) return
        settled = true
        clearTimeout(timer)
        reject(error)
      })
  })
}

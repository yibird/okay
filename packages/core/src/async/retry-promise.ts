/**
 * 重试 Promise,泛型T表示Promise的返回值类型
 * @param func 要重试的 Promise 函数
 * @param maxRetryCount 最大重试次数,默认 3 次
 * @param delay 重试间隔时间(ms),默认 100 毫秒
 * @param shouldRetry 重试条件函数,默认所有错误都重试
 * @returns 重试后的 Promise
 */
export async function retryPromise<T>(
  func: () => Promise<T>,
  maxRetryCount = 3,
  delay = 100,
  shouldRetry: (error: any) => boolean = () => true,
) {
  try {
    return await func()
  } catch (error) {
    if (maxRetryCount <= 0 || !shouldRetry(error)) throw error
    await new Promise((res) => setTimeout(res, delay))
    return retryPromise(func, maxRetryCount - 1, delay, shouldRetry)
  }
}

type RetryPredicate<E = unknown> = (error: E, attempt: number) => boolean
type RetryDelay = number | ((attempt: number) => number)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 对失败的异步函数执行重试。
 *
 * `maxRetryCount` 表示首次执行失败后的额外重试次数。
 * 例如 `maxRetryCount = 3` 时，最多会执行 4 次。
 *
 * @param func 需要执行的异步函数。
 * @param maxRetryCount 首次失败后的最大重试次数。
 * @param delay 每次重试之间的延迟毫秒数，或接收当前重试序号（第 1 次重试传入 1，第 2 次传入 2，以此类推）返回延迟的函数。
 * @param shouldRetry 针对特定错误决定是否继续重试的断言函数；第二个参数为当前重试序号（从 1 开始）。
 * @returns 首次成功执行的返回值。
 * @throws 重试耗尽或 `shouldRetry` 返回 `false` 时抛出最后一次错误。
 */
export async function retry<T, E = unknown>(
  func: () => Promise<T>,
  maxRetryCount = 3,
  delay: RetryDelay = 100,
  shouldRetry: RetryPredicate<E> = () => true,
): Promise<T> {
  const retries = Math.max(0, Math.floor(maxRetryCount))
  for (let attempt = 0; ; attempt++) {
    try {
      return await func()
    } catch (error) {
      if (attempt >= retries || !shouldRetry(error as E, attempt + 1)) throw error
      const ms = typeof delay === 'function' ? delay(attempt + 1) : delay
      if (ms > 0) await sleep(ms)
    }
  }
}

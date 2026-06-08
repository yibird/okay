export interface SingleFlightOptions<Args extends unknown[]> {
  /**
   * 根据调用参数生成去重键。
   *
   * 未传入时所有参数共享同一个 pending Promise（原有行为）。
   * 传入后按键去重：不同键的并发调用各自独立执行。
   */
  key?: (...args: Args) => unknown
}

/**
 * 让并发调用共享同一个正在进行的异步请求。
 *
 * 被包装函数尚未完成时，后续调用会拿到同一个 Promise。
 * Promise 完成后，下一次调用会重新执行；并发期间后续调用的参数会被忽略，因为首个调用拥有共享结果。
 *
 * @param func 需要包装的异步函数。
 * @param options 去重键生成函数。
 * @returns 参数和返回值类型保持一致的共享请求函数。
 */
export function singleFlight<Args extends unknown[], Result>(
  func: (...args: Args) => Promise<Result>,
  options?: SingleFlightOptions<Args>,
): (...args: Args) => Promise<Result> {
  const keyOf = options?.key
  const pending = new Map<unknown, Promise<Result>>()

  return (...args: Args) => {
    const k = keyOf ? keyOf(...args) : null
    const existing = pending.get(k)
    if (existing) return existing

    let promise: Promise<Result>
    try {
      promise = func(...args)
    } catch (error) {
      /* v8 ignore next */
      return Promise.reject(error)
    }

    promise = promise.finally(() => pending.delete(k))
    pending.set(k, promise)
    return promise
  }
}

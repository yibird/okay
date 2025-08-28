/**
 * 确保同一时间只有一个相同请求在执行,避免重复调用（竞态条件保护）。泛型T表示Promise的返回值类型
 * @param func 要执行的 Promise 函数
 * @returns 包装后的 Promise 函数
 */
export function singleFlight<T extends (...args: any[]) => Promise<any>>(
  func: T,
) {
  let pendingPromise: Promise<any> | null = null

  return ((...args: any[]) => {
    if (pendingPromise) {
      return pendingPromise
    }
    pendingPromise = func(...args).finally(() => {
      pendingPromise = null
    })
    return pendingPromise
  }) as T
}

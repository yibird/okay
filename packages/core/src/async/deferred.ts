/**
 * 将 `resolve` 和 `reject` 暴露给调用方控制的 Promise。
 */
export interface Deferred<T, E = unknown> {
  /**
   * 由 `resolve` 和 `reject` 控制的 Promise。
   */
  promise: Promise<T>
  /**
   * 使用值或类 Promise 值完成 Promise。
   */
  resolve: (value: T | PromiseLike<T>) => void
  /**
   * 使用可选原因拒绝 Promise。
   */
  reject: (reason?: E) => void
}

/**
 * 创建一个可在外部延迟完成或拒绝的 Promise。
 *
 * 当完成信号必须跨作用域传递时使用该方法；如果完成流程就在本地，优先使用普通 Promise 构造器。
 *
 * @returns 暴露 `resolve` 和 `reject` 的 Promise 控制对象。
 */
export function deferred<T = void, E = unknown>(): Deferred<T, E> {
  let resolve!: Deferred<T, E>['resolve']
  let reject!: Deferred<T, E>['reject']
  const promise = new Promise<T>((onResolve, onReject) => {
    resolve = onResolve
    reject = onReject
  })
  return {
    promise,
    resolve,
    reject,
  }
}

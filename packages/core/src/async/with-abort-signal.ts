/**
 * 具有AbortSignal的可取消Promise
 * @param promise 原始Promise
 * @param signal 取消信号
 * @returns 包含Promise和取消函数的对象
 */
export function withAbortSignal<T>(
  promise: Promise<T>,
  signal?: AbortSignal,
): Promise<T> {
  if (signal?.aborted) return Promise.reject(new Error('Aborted'))

  return new Promise((resolve, reject) => {
    signal?.addEventListener('abort', () => reject(new Error('Aborted')))
    promise.then(resolve).catch(reject)
  })
}

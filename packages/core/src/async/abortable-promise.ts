/**
 * 可取消的Promise
 * @param promise 原始Promise
 * @returns 包含Promise和取消函数的对象
 */
export function abortablePromise<T>(promise: Promise<T>) {
  let abort: () => void
  const wrappedPromise = new Promise<T>((resolve, reject) => {
    abort = () => reject(new Error('Promise aborted'))
    promise.then(resolve).catch(reject)
  })

  return {
    promise: wrappedPromise,
    abort: () => abort!(),
  }
}

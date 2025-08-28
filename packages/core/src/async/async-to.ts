/**
 * 异步函数转换为Promise<[E, null] | [null, T]>,Promise返回数组中第一项为错误信息,第二项为结果,
 * 异步函数执行成功时,返回[null, T],异步函数执行失败时,返回[E, null]
 * @param promise 异步函数
 * @param callback 回调函数
 * @returns Promise<[E, null] | [null, T]>
 */
export async function asyncTo<T, E = Error>(
  promise: Promise<T>,
  callback?: () => void,
): Promise<[E, null] | [null, T]> {
  try {
    const res = await promise
    return [null, res]
  } catch (error) {
    return [error as E, null]
  } finally {
    // 如果 callback 是异步的也等待它
    // 并且保证 finally 一定在函数返回前执行（对 await 的调用）
    if (callback) {
      callback()
    }
  }
}

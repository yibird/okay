/**
 * 将 Promise 结果转换为错误优先元组。
 *
 * 成功时返回 `[null, value]`，失败时返回 `[error, null]`。
 * 可选回调会在 `finally` 阶段执行，适合做轻量清理。
 *
 * @param promise 需要等待并捕获错误的 Promise。
 * @param callback 可选的清理回调。
 * @returns 包含错误或成功值的元组。
 */
export async function asyncTo<T, E = unknown>(
  promise: Promise<T>,
  callback?: () => void,
): Promise<[E, null] | [null, T]> {
  try {
    const res = await promise
    return [null, res]
  } catch (error) {
    return [error as E, null]
  } finally {
    if (callback) {
      callback()
    }
  }
}

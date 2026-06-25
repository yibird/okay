import { readText } from './readText'

/**
 * 将 `Blob` 读取并解析为 JSON。
 *
 * 解析失败且提供 `fallback` 时会返回兜底值；未提供兜底值时会抛出错误，并尽可能把原始解析错误挂到
 * `cause` 上。
 *
 * @param blob 包含 JSON 文本的 Blob。
 * @param fallback 解析失败时返回的可选兜底值。
 * @returns 解析后的 JSON 值。
 * @throws 解析失败且未提供兜底值时抛出错误。
 */
export async function readJson<T = unknown>(blob: Blob, fallback?: T): Promise<T> {
  const text = await readText(blob)

  try {
    return JSON.parse(text) as T
  } catch (error) {
    if (fallback !== undefined) return fallback

    const jsonError = new Error('Failed to parse blob as JSON.') as Error & { cause?: unknown }
    jsonError.cause = error
    throw jsonError
  }
}

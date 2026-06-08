import { readText, type ReadTextOptions } from './readText'

/**
 * 将 `Blob` 读取为文本。
 *
 * 这是 `readText` 的别名，保留给偏好 blob-first 命名的调用方。
 *
 * @param blob 需要读取的 Blob。
 * @param options 可选的文本编码。
 * @returns Blob 中的文本内容。
 */
export function blobText(blob: Blob, options?: ReadTextOptions): Promise<string> {
  return readText(blob, options)
}

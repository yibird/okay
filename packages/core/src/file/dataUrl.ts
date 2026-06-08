import { blobBase64 } from './blobBase64'
import { readWithFileReader } from './readWithFileReader'

/**
 * 将 `Blob` 读取为 data URL。
 *
 * 类浏览器运行时会使用 `FileReader.readAsDataURL`；没有 `FileReader` 的运行时会回退到手动 base64
 * 编码并拼接 Blob MIME 类型。
 *
 * @param blob 需要读取的 Blob。
 * @returns data URL 字符串。
 */
export async function dataUrl(blob: Blob): Promise<string> {
  if (typeof globalThis.FileReader === 'function') {
    return readWithFileReader<string>(blob, 'readAsDataURL')
  }

  return `data:${blob.type || 'application/octet-stream'};base64,${await blobBase64(blob)}`
}

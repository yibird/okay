import { readBuffer } from './readBuffer'

const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const BASE64_CHUNK_SIZE = 8192

const bytesToBase64 = (bytes: Uint8Array) => {
  const chunks: string[] = []
  let chunk = ''

  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index]
    const hasSecond = index + 1 < bytes.length
    const hasThird = index + 2 < bytes.length
    const second = hasSecond ? bytes[index + 1] : 0
    const third = hasThird ? bytes[index + 2] : 0
    const triplet = (first << 16) | (second << 8) | third

    chunk += base64Chars[(triplet >> 18) & 0x3f]
    chunk += base64Chars[(triplet >> 12) & 0x3f]
    chunk += hasSecond ? base64Chars[(triplet >> 6) & 0x3f] : '='
    chunk += hasThird ? base64Chars[triplet & 0x3f] : '='

    if (chunk.length >= BASE64_CHUNK_SIZE) {
      /* v8 ignore next 2 */
      chunks.push(chunk)
      chunk = ''
    }
  }

  if (chunk.length > 0) chunks.push(chunk)

  return chunks.join('')
}

/**
 * 读取 `Blob` 并返回原始 base64 内容。
 *
 * 返回值不包含 data URL 前缀。实现不依赖 Node `Buffer`，可在类浏览器运行时和现代 Node 中工作。
 *
 * @param blob 需要读取的 Blob。
 * @returns Blob 字节对应的 base64 文本。
 */
export async function blobBase64(blob: Blob): Promise<string> {
  return bytesToBase64(new Uint8Array(await readBuffer(blob)))
}

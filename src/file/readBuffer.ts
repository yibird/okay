import { readWithFileReader } from './readWithFileReader'

/**
 * 将 `Blob` 读取为 `ArrayBuffer`。
 *
 * 可用时优先使用原生 `blob.arrayBuffer()`；在较旧的类浏览器运行时中回退到 `FileReader`。
 *
 * @param blob 需要读取的 Blob。
 * @returns Blob 字节对应的 `ArrayBuffer`。
 */
export function readBuffer(blob: Blob): Promise<ArrayBuffer> {
  if (typeof blob.arrayBuffer === 'function') {
    return blob.arrayBuffer()
  }

  return readWithFileReader<ArrayBuffer>(blob, 'readAsArrayBuffer')
}

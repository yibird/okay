import { readWithFileReader } from './readWithFileReader'

/**
 * 文本读取配置。
 */
export interface ReadTextOptions {
  /**
   * `FileReader.readAsText` 使用的可选文本编码。
   */
  encoding?: string
}

/**
 * 将 `Blob` 读取为文本。
 *
 * 未请求自定义编码时优先使用 `blob.text()`；显式编码或较旧类浏览器运行时会回退到 `FileReader`。
 *
 * @param blob 需要读取的 Blob。
 * @param options 可选的文本编码。
 * @returns Blob 中的文本内容。
 */
export function readText(blob: Blob, options: ReadTextOptions = {}): Promise<string> {
  if (!options.encoding && typeof blob.text === 'function') {
    return blob.text()
  }

  return readWithFileReader<string>(blob, 'readAsText', options.encoding)
}

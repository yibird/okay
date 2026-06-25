/**
 * `FileReader` 支持的读取方法。
 */
export type FileReaderReadMethod = 'readAsArrayBuffer' | 'readAsDataURL' | 'readAsText'

/**
 * 使用 `FileReader` 读取 Blob。
 *
 * 该 helper 统一处理事件清理和错误，在现代 `Blob` 方法不可用的运行时中作为回退实现。
 *
 * @param blob 需要读取的 Blob。
 * @param method 需要调用的 FileReader 读取方法。
 * @param encoding `readAsText` 使用的可选编码。
 * @returns 由调用方指定类型的读取结果。
 * @throws 当前环境没有 `FileReader` 时抛出错误。
 */
export function readWithFileReader<T>(
  blob: Blob,
  method: FileReaderReadMethod,
  encoding?: string,
): Promise<T> {
  if (typeof globalThis.FileReader !== 'function') {
    return Promise.reject(new Error('FileReader is not available in this environment.'))
  }

  return new Promise((resolve, reject) => {
    const reader = new globalThis.FileReader()

    const cleanup = () => {
      reader.removeEventListener('load', handleLoad)
      reader.removeEventListener('error', handleError)
      reader.removeEventListener('abort', handleAbort)
    }
    const handleLoad = () => {
      cleanup()
      resolve(reader.result as T)
    }
    const handleError = () => {
      cleanup()
      reject(reader.error ?? new Error('Failed to read blob.'))
    }
    const handleAbort = () => {
      cleanup()
      reject(new Error('Blob reading was aborted.'))
    }

    reader.addEventListener('load', handleLoad)
    reader.addEventListener('error', handleError)
    reader.addEventListener('abort', handleAbort)

    try {
      if (method === 'readAsArrayBuffer') {
        reader.readAsArrayBuffer(blob)
      } else if (method === 'readAsDataURL') {
        reader.readAsDataURL(blob)
      } else {
        reader.readAsText(blob, encoding)
      }
    } catch (error) {
      /* v8 ignore next 2 */
      cleanup()
      reject(error)
    }
  })
}

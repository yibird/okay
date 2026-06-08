import { fileExt } from './fileExt'

/**
 * 文件名拆分结果。
 */
export interface FileParts {
  /**
   * 不包含路径、查询参数和 hash 的完整文件名。
   */
  baseName: string
  /**
   * 不包含扩展名的文件名。
   */
  name: string
  /**
   * 不带前导点的小写扩展名。
   */
  extension: string
}

const stripQueryAndHash = (fileName: string) => fileName.split(/[?#]/, 1)[0]

/**
 * 将文件名或路径拆分为完整文件名、主文件名和扩展名。
 *
 * `.env` 这类隐藏文件会被视为没有扩展名。
 *
 * @param fileName 文件名、路径或类 URL 路径。
 * @returns 解析后的文件名组成部分。
 */
export function fileParts(fileName: string): FileParts {
  const normalized = stripQueryAndHash(fileName.trim()).replace(/\\/g, '/')
  const baseName = normalized.slice(normalized.lastIndexOf('/') + 1)
  const extension = fileExt(baseName)

  if (!extension) {
    return {
      baseName,
      name: baseName,
      extension,
    }
  }

  return {
    baseName,
    name: baseName.slice(0, -extension.length - 1),
    extension,
  }
}

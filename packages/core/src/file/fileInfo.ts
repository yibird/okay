import { fileParts } from './fileParts'
import { formatBytes, type FormatBytesOptions } from './formatBytes'

/**
 * 文件工具接受的最小类文件对象形态。
 */
export interface FileLike {
  /**
   * 文件名，可包含扩展名。
   */
  name?: string
  /**
   * 文件大小，单位字节。
   */
  size: number
  /**
   * 平台报告的 MIME 类型。
   */
  type?: string
}

/**
 * 生成文件信息时的格式化配置。
 */
export interface FileInfoOptions {
  /**
   * 用于生成 `sizeText` 的字节格式化配置。
   */
  size?: FormatBytesOptions
}

/**
 * 归一化后的文件元信息。
 */
export interface FileInfo {
  name: string
  baseName: string
  extension: string
  size: number
  sizeText: string
  type: string
  lastModified?: number
}

/**
 * 带可选修改时间的类文件对象。
 */
export type FileLikeWithMeta = FileLike & {
  lastModified?: number
}

/**
 * 为类文件对象生成归一化元信息。
 *
 * 缺失的名称和类型会归一化为空字符串；只有输入提供数字形式的 `lastModified` 时才会写入结果。
 *
 * @param file 需要读取信息的类文件对象。
 * @param options 大小文本格式化配置。
 * @returns 归一化后的文件元信息。
 */
export function fileInfo(file: FileLikeWithMeta, options: FileInfoOptions = {}): FileInfo {
  const parsedName = fileParts(file.name ?? '')
  const lastModified = typeof file.lastModified === 'number' ? file.lastModified : undefined

  const result: FileInfo = {
    name: parsedName.name,
    baseName: parsedName.baseName,
    extension: parsedName.extension,
    size: file.size,
    sizeText: formatBytes(file.size, options.size),
    type: file.type ?? '',
  }

  if (lastModified !== undefined) result.lastModified = lastModified

  return result
}

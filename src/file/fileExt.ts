const queryHashRe = /[?#]/

const stripQueryAndHash = (fileName: string) => fileName.split(queryHashRe, 1)[0]

/**
 * 从文件名或路径中提取小写扩展名。
 *
 * 查询参数、hash、Windows 路径分隔符和目录片段都会被忽略。
 * `.env` 这类隐藏文件会被视为没有扩展名。
 *
 * @param fileName 文件名、路径或类 URL 路径。
 * @param withDot 是否包含前导点。
 * @returns 小写扩展名；不存在扩展名时返回空字符串。
 */
export function fileExt(fileName: string, withDot = false): string {
  const trimmed = fileName.trim()
  const normalized =
    trimmed.indexOf('?') >= 0 || trimmed.indexOf('#') >= 0 ? stripQueryAndHash(trimmed) : trimmed
  const cleanPath = normalized.indexOf('\\') >= 0 ? normalized.replace(/\\/g, '/') : normalized
  const baseName = cleanPath.slice(cleanPath.lastIndexOf('/') + 1)
  const dotIndex = baseName.lastIndexOf('.')
  if (dotIndex <= 0 || dotIndex === baseName.length - 1) return ''
  const extension = baseName.slice(dotIndex)
  return withDot ? extension.toLowerCase() : extension.slice(1).toLowerCase()
}

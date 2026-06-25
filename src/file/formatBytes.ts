/**
 * 字节大小格式化配置。
 */
export interface FormatBytesOptions {
  /**
   * 非字节单位最多保留的小数位数。
   */
  decimals?: number
  /**
   * 单位进制；`1024` 使用二进制单位，`1000` 使用十进制单位。
   */
  base?: 1000 | 1024
}

const decimalUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const
const binaryUnits = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'] as const

/**
 * 将字节数格式化为十进制或二进制单位文本。
 *
 * 负数会保留符号；小数末尾多余的 `0` 会被裁剪，让展示更紧凑。
 *
 * @param bytes 需要格式化的字节数。
 * @param options 小数精度和单位进制配置。
 * @returns 适合展示的字节大小文本。
 * @throws 当 `bytes` 不是有限数字时抛出错误。
 */
export function formatBytes(bytes: number, options: FormatBytesOptions = {}): string {
  if (!Number.isFinite(bytes)) {
    throw new TypeError('bytes must be a finite number')
  }

  const base = options.base ?? 1024
  const decimals = Math.max(0, options.decimals ?? 2)
  const units = base === 1024 ? binaryUnits : decimalUnits
  const sign = bytes < 0 ? '-' : ''
  const absBytes = Math.abs(bytes)

  // Use Math.log for O(1) unit calculation instead of while loop
  const unitIndex =
    absBytes === 0 ? 0 : Math.min(Math.floor(Math.log(absBytes) / Math.log(base)), units.length - 1)
  const size = absBytes / Math.pow(base, unitIndex)

  const formatted = unitIndex === 0 ? String(size) : size.toFixed(decimals).replace(/\.?0+$/, '')

  return `${sign}${formatted} ${units[unitIndex]}`
}

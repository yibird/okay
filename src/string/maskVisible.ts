/**
 * 通用脱敏计算出的可见和隐藏字符数量。
 */
export interface MaskVisibleCounts {
  /**
   * 最终保留的开头字符数。
   */
  startCount: number
  /**
   * 最终保留的结尾字符数。
   */
  endCount: number
  /**
   * 最终被隐藏的原始字符数。
   */
  hiddenCount: number
}

/**
 * 计算遮盖时的开头保留数、结尾保留数和隐藏数。
 *
 * 当最小隐藏数量无法满足时，会按需减少结尾或开头保留数量，确保短内容也不会完整暴露。
 *
 * @param length 原始内容长度。
 * @param keepStart 调用方期望保留的开头数量。
 * @param keepEnd 调用方期望保留的结尾数量。
 * @param minMaskLength 至少需要隐藏的数量。
 * @returns 归一化后的可见和隐藏数量。
 */
export const resolveVisibleCounts = (
  length: number,
  keepStart: number,
  keepEnd: number,
  minMaskLength: number,
): MaskVisibleCounts => {
  let startCount = Math.min(keepStart, length)
  let endCount = Math.min(keepEnd, Math.max(0, length - startCount))
  let hiddenCount = length - startCount - endCount

  if (length > 0 && hiddenCount < minMaskLength) {
    const targetHiddenCount = Math.min(length, minMaskLength)
    const visibleCount = length - targetHiddenCount
    startCount = Math.min(startCount, visibleCount)
    endCount = Math.min(endCount, Math.max(0, visibleCount - startCount))
    hiddenCount = length - startCount - endCount
  }

  return {
    startCount,
    endCount,
    hiddenCount,
  }
}

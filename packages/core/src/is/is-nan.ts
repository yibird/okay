/**
 * 判断target是否是NaN
 * @param value 目标值
 * @returns 返回一个布尔值
 */
export function isNaN(value: unknown) {
  if (typeof value !== 'number') {
    return false
  }
  return Number.isNaN(value) && value !== Infinity && value !== -Infinity
}

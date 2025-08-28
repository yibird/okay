/**
 * 计算数组平均值
 * @param arr 数字数组
 * @returns 平均值
 */
export function average(arr: number[]) {
  if (arr.length === 0) return 0
  return arr.reduce((acc, val) => acc + val, 0) / arr.length
}

/**
 * 计算数组平均值
 * @param arr 数组
 * @param func 计算平均值的函数,返回数组元素的数值
 * @returns 平均值
 */
export function averageBy<T>(arr: T[], func: (item: T) => number) {
  if (arr.length === 0) return 0
  return arr.reduce((acc, val) => acc + func(val), 0) / arr.length
}

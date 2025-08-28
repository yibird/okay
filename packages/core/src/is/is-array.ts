/**
 * 判断目标值是否是数组
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isArray(target: any): target is Array<any> {
  return Array.isArray(target)
}

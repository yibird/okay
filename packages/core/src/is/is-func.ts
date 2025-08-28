/**
 * 判断目标值是否是一个function
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isFunc(target: unknown): target is Function {
  return typeof target === 'function'
}

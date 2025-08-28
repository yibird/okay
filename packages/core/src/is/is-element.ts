/**
 * 判断目标值是否是Document Element
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isElement(target: unknown): target is Element {
  return typeof target === 'object' && !!(target as any)?.tagName
}

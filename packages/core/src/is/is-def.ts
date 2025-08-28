/**
 * 判断目标值是否是undefined
 * @param target 目标值
 * @returns 布尔值,是返回true,否则返回false
 */

export function isDef<T = unknown>(target?: T): target is T {
  return typeof target !== 'undefined'
}

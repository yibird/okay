import { isDef } from './is-def'

/**
 * 判断目标值是否为undefined
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isUnDef<T = unknown>(target?: T): target is T {
  return !isDef(target)
}

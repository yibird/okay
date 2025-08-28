import { isNull } from './is-null'
import { isUnDef } from './is-un-def'

/**
 * 判断目标值为null或为undefined
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isNullOrUndef(target: unknown) {
  return isUnDef(target) || isNull(target)
}

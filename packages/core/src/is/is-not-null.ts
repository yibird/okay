import { isNull } from './is-null'

/**
 * 判断目标值是否非空
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isNotNull(target: unknown) {
  return !isNull(target)
}

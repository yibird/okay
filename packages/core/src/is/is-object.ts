import { isNotNull } from './is-not-null'
import { rawType } from './raw-type'

/**
 * 判断目标值是否为object类型
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isObject(target: unknown): target is object {
  return isNotNull(target) && rawType(target) === 'Object'
}

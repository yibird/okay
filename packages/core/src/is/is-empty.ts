import { isArray } from './is-array'
import { isMap } from './is-map'
import { isObject } from './is-object'
import { isSet } from './is-set'
import { isString } from './is-string'

/**
 * 判断目标值是否为空
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isEmpty(target: unknown) {
  if (isArray(target) || isString(target)) return target.length === 0
  if (isMap(target) || isSet(target)) return target.size === 0
  if (isObject(target)) return Object.keys(target).length === 0
  return false
}

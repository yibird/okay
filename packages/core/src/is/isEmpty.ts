import { isArray } from './isArray'
import { isMap } from './isMap'
import { isObject } from './isObject'
import { isSet } from './isSet'
import { isString } from './isString'

/**
 * 判断集合类值是否为空。
 *
 * 数组和字符串按 `length === 0` 判断；Map 和 Set 按 `size === 0` 判断；普通对象按自身可枚举字符串键判断。
 * 其他类型会返回 `false`。
 *
 * @param target 需要检查的值。
 * @returns 空数组、空字符串、空 Map、空 Set 和空普通对象返回 `true`。
 */
export function isEmpty(target: unknown): boolean {
  if (isArray(target) || isString(target)) return target.length === 0
  if (isMap(target) || isSet(target)) return target.size === 0
  if (isObject(target)) return Object.keys(target).length === 0
  return false
}

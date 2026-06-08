import { rawType } from './rawType'

/**
 * 判断值是否为普通对象。
 *
 * 数组、日期、Map、Set、函数和 `null` 都会返回 `false`。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 的原始类型为 `Object` 时返回 `true`。
 */
export function isObject(target: unknown): target is Record<PropertyKey, unknown> {
  return target !== null && rawType(target) === 'Object'
}

import { rawType } from './rawType'

/**
 * 判断值是否为 `Date` 对象。
 *
 * 该方法只检查对象类型；如果还需要排除无效日期，请结合 `Number.isNaN(date.getTime())`。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是 `Date` 对象时返回 `true`。
 */
export function isDate(target: unknown): target is Date {
  return rawType(target) === 'Date'
}

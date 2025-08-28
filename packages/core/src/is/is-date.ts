import { rawType } from './raw-type'

/**
 * 判断目标值是否是Date类型
 * @param target 目标值
 * @returns 布尔值,是返回true,否则返回false
 */
export function isDate(target: unknown): target is Date {
  return rawType(target) === 'Date'
}

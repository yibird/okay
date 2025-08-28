import { rawType } from './raw-type'

/**
 * 判断目标值是否为number类型
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isNumber(target: unknown): target is number {
  return rawType(target) === 'Number'
}

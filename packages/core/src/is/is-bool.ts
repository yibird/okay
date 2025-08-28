import { rawType } from './raw-type'

/**
 * 判断目标值是否是Boolean类型
 * @param target 目标值
 * @returns 布尔值,是返回true,否则返回false
 */
export function isBool(target: unknown): target is boolean {
  return rawType(target) === 'Boolean'
}

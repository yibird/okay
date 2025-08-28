import { rawType } from './raw-type'

/**
 * 判断目标值是否为Window
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isWindow(target: unknown): target is Window {
  return typeof window !== 'undefined' && rawType(target) === 'Window'
}

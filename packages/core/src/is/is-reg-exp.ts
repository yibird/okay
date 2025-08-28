import { rawType } from './raw-type'

/**
 * 判断目标值是否为RegExp
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isRegExp(target: unknown): target is RegExp {
  return rawType(target) === 'RegExp'
}

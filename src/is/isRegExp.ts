import { rawType } from './rawType'

/**
 * 判断值是否为正则表达式。
 *
 * @param target 需要检查的值。
 * @returns 当 `target` 是 `RegExp` 时返回 `true`。
 */
export function isRegExp(target: unknown): target is RegExp {
  return rawType(target) === 'RegExp'
}

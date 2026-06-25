import { rawType } from './rawType'

/**
 * 判断值是否为当前运行时的 `Window` 对象。
 *
 * @param target 需要检查的值。
 * @returns 当浏览器全局对象存在且 `target` 原始类型为 `Window` 时返回 `true`。
 */
export function isWindow(target: unknown): target is Window {
  return typeof window !== 'undefined' && rawType(target) === 'Window'
}

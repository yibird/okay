import { isFinite } from './isFinite'
import { isNaN } from './isNan'

/**
 * 判断值是否为 `NaN` 或有限数字。
 *
 * 当需要拒绝无穷大，但仍允许 `NaN` 作为有意义的哨兵值时可使用该方法。
 *
 * @param target 需要检查的值。
 * @returns 有限数字和 `NaN` 返回 `true`；无穷大和非数字返回 `false`。
 */
export function isNaNOrFinite(target: unknown): target is number {
  return typeof target === 'number' && (isNaN(target) || isFinite(target))
}

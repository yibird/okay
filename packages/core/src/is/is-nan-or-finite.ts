import { isNaN } from './is-nan'
import { isFinite } from './is-finite'
/**
 * 判断target是否是NaN或有限值
 * @param target 目标值
 * @returns 返回一个布尔值
 */
export function isNaNOrFinite(target: unknown) {
  if (typeof target !== 'number') {
    return false
  }
  return isNaN(target) || isFinite(target)
}

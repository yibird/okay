import { rawType } from './raw-type'

/**
 * 判断目标值是否是Bigint类型
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isBigint(target: bigint): target is bigint {
  return rawType(target) === 'BigInt'
}

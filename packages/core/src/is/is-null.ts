/**
 * 判断目标值是否为空
 * @param target 目标值
 * @returns 返回一个布尔值,是返回true,否则返回false
 */
export function isNull(target: unknown): target is null {
  return target === null
}

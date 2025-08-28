/**
 * 获取目标元素原始类型
 * @param target 目标值
 * @returns 元素原始类型,一个字符串
 */
export const rawType = (target: unknown) => {
  return Object.prototype.toString.call(target).slice(8, -1)
}

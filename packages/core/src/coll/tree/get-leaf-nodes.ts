/**
 * 基于深度优先获取所有叶子节点(没有子节点的节点)的函数
 * @param tree 树结构
 * @param childrenKey 子节点属性名
 * @returns 返回所有叶子节点的数组
 */
export function getLeafNodes<T extends Record<string, any>>(
  tree: T[],
  childrenKey: string = 'children',
): T[] {
  const result: T[] = []

  // 递归辅助函数
  function traverse(node: T) {
    const children = node[childrenKey] as T[] | undefined
    if (!Array.isArray(children) || children.length === 0) {
      result.push(node)
    } else {
      // 深度优先遍历子节点
      children.forEach((child) => traverse(child))
    }
  }
  tree.forEach((root) => traverse(root))
  return result
}

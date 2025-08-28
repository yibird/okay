/**
 * 基于后序遍历树结构的函数
 * @param tree 树结构
 * @param visitor 访问器函数,用于处理每个节点
 * @param childrenKey 子节点键名
 */
export function eachPostOrder<T extends Record<string, any>>(
  tree: T[],
  visitor: (node: T, level: number, parent: T | null) => void,
  childrenKey = 'children',
) {
  const walk = (nodes: T[], level: number, parent: T | null) => {
    for (const node of nodes) {
      const children = node[childrenKey] as T[] | undefined // 不再报错
      if (Array.isArray(children)) {
        walk(children, level + 1, node)
      }
      visitor(node, level, parent)
    }
  }
  walk(tree, 0, null)
}

/**
 * 基于前序遍历树结构的函数
 * @param tree 树结构
 * @param visitor 访问器函数,用于处理每个节点
 * @param childrenKey 子节点键名
 */
export function eachPreOrder<T extends Record<string, any>>(
  tree: T[],
  visitor: (node: T, level: number, parent: T | null) => void,
  childrenKey = 'children',
) {
  const walk = (nodes: T[], level: number, parent: T | null) => {
    for (const node of nodes) {
      visitor(node, level, parent)
      const children = node[childrenKey] as T[] | undefined
      if (Array.isArray(children)) {
        walk(children, level + 1, node)
      }
    }
  }
  walk(tree, 0, null)
}

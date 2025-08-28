/**
 * 获取树的高度
 * @param tree 树结构
 * @param childrenKey 子节点键名
 * @returns 树的深度
 */
export function getDepth<T extends Record<string, any>>(
  tree: T[],
  childrenKey = 'children',
) {
  if (!tree?.length) return 0
  let depth = 0
  const queue: { node: T; depth: number }[] = tree.map((node) => ({
    node,
    depth: 1,
  }))

  while (queue.length > 0) {
    const { node, depth: currentDepth } = queue.shift()!
    depth = Math.max(depth, currentDepth)

    const children = node[childrenKey] as T[] | undefined
    if (children?.length) {
      queue.push(
        ...children.map((child) => ({
          node: child,
          depth: currentDepth + 1,
        })),
      )
    }
  }
  return depth
}

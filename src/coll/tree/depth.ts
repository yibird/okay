import { DEFAULT_CHILDREN_KEY, getTreeChildren } from './treeAccess'

/**
 * 计算树的最大节点深度。
 *
 * 根节点深度计为 `1`，空树深度为 `0`。实现使用广度优先迭代，避免深层树触发调用栈限制。
 *
 * @param tree 树根节点。
 * @param childrenKey 包含子节点的字段。
 * @returns 树的最大深度。
 */
export function depth<T>(tree: T[], childrenKey = DEFAULT_CHILDREN_KEY): number {
  if (!Array.isArray(tree) || tree.length === 0) return 0

  let maxDepth = 0
  let current: T[] = tree.slice()
  let next: T[] = []

  while (current.length > 0) {
    maxDepth++
    for (let i = 0; i < current.length; i++) {
      const children = getTreeChildren(current[i], childrenKey)
      if (children) {
        for (let j = 0; j < children.length; j++) next.push(children[j])
      }
    }
    // Swap buffers — reuse the now-empty current array for the next level.
    const tmp = current
    current = next
    next = tmp
    next.length = 0
  }

  return maxDepth
}

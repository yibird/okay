import { DEFAULT_CHILDREN_KEY, getTreeChildren } from './treeAccess'

/**
 * 收集树中的所有叶子节点。
 *
 * 当节点的子节点字段缺失、不是数组或为空数组时，会被视为叶子节点。
 * 返回节点保持从左到右的遍历顺序。
 *
 * @param tree 树根节点。
 * @param childrenKey 包含子节点的字段。
 * @returns 按前序遇到顺序排列的叶子节点。
 */
export function leaves<T>(tree: T[], childrenKey = DEFAULT_CHILDREN_KEY): T[] {
  if (!Array.isArray(tree) || tree.length === 0) return []

  const leafNodes: T[] = []
  const stack: T[] = []
  // Push in reverse order to maintain left-to-right traversal
  for (let i = tree.length - 1; i >= 0; i--) stack.push(tree[i])

  while (stack.length > 0) {
    const node = stack.pop()!
    const children = getTreeChildren(node, childrenKey)

    if (!children || children.length === 0) {
      leafNodes.push(node)
      continue
    }

    // Push in reverse to maintain order
    for (let index = children.length - 1; index >= 0; index--) {
      stack.push(children[index])
    }
  }

  return leafNodes
}

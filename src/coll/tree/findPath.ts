import type { TreeConfig } from './types'
import { DEFAULT_CHILDREN_KEY, DEFAULT_ID_KEY, getTreeChildren, getTreeValue } from './treeAccess'

/**
 * 查找从根节点到目标节点的路径。
 *
 * 返回数组会包含目标节点本身。匹配节点时会把节点 id 和目标 id 转成字符串比较，
 * 因此数值 `1` 和字符串 `'1'` 会被视为同一个节点标识。
 *
 * @param tree 需要搜索的根节点数组。
 * @param targetId 目标节点 id。
 * @param config 自定义 id 字段名和子节点字段名。
 * @returns 根节点到目标节点的路径；未找到目标节点时返回空数组。
 */
export function findPath<T>(tree: T[], targetId: string | number, config: TreeConfig<T> = {}): T[] {
  const idKey = config.idKey ?? DEFAULT_ID_KEY
  const childrenKey = config.childrenKey ?? DEFAULT_CHILDREN_KEY
  const targetStr = String(targetId)

  // Use an explicit stack + parent map to avoid recursion depth issues on deep trees.
  const parentMap = new Map<T, T | null>()
  const stack: T[] = []

  // Push in reverse to maintain left-to-right traversal
  for (let index = tree.length - 1; index >= 0; index--) {
    const node = tree[index]
    stack.push(node)
    parentMap.set(node, null)
  }

  while (stack.length > 0) {
    const node = stack.pop()!
    const id = getTreeValue(node, idKey)

    if (id === targetId || String(id) === targetStr) {
      // Reconstruct path from root to the matched node.
      const path: T[] = []
      let current: T | null = node
      while (current !== null) {
        path.push(current)
        current = parentMap.get(current) ?? null
      }
      return path.reverse()
    }

    const children = getTreeChildren(node, childrenKey)
    if (children && children.length > 0) {
      for (let index = children.length - 1; index >= 0; index--) {
        const child = children[index]
        stack.push(child)
        parentMap.set(child, node)
      }
    }
  }

  return []
}

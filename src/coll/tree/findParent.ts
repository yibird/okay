import type { TreeConfig } from './types'
import { DEFAULT_CHILDREN_KEY, DEFAULT_ID_KEY, getTreeChildren, getTreeValue } from './treeAccess'

/**
 * 查找第一个 id 匹配 `targetId` 的节点父级。
 *
 * 根节点没有父级，因此返回 `null`。匹配时按字符串值比较 id，因此 `1` 和 `'1'` 会被视为同一个 id。
 *
 * @param tree 需要搜索的树根节点。
 * @param targetId 目标节点 id。
 * @param config 自定义 id 和子节点字段名。
 * @returns 父节点；目标是根节点或未找到时返回 `null`。
 */
export function findParent<T>(
  tree: T[],
  targetId: string | number,
  config: TreeConfig<T> = {},
): T | null {
  if (tree.length === 0) return null

  const idKey = config.idKey ?? DEFAULT_ID_KEY
  const childrenKey = config.childrenKey ?? DEFAULT_CHILDREN_KEY
  const targetStr = String(targetId)
  const nodeStack: T[] = []
  const parentStack: Array<T | null> = []

  // Push in reverse to maintain left-to-right traversal
  for (let index = tree.length - 1; index >= 0; index--) {
    nodeStack.push(tree[index])
    parentStack.push(null)
  }

  while (nodeStack.length > 0) {
    const node = nodeStack.pop()!
    const parent = parentStack.pop()!
    const id = getTreeValue(node, idKey)
    if (id === targetId || String(id) === targetStr) return parent

    const children = getTreeChildren(node, childrenKey)
    if (children && children.length > 0) {
      for (let index = children.length - 1; index >= 0; index--) {
        nodeStack.push(children[index])
        parentStack.push(node)
      }
    }
  }

  return null
}

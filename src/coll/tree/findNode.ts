import type { TreeConfig } from './types'
import { DEFAULT_CHILDREN_KEY, DEFAULT_ID_KEY, getTreeChildren, getTreeValue } from './treeAccess'

/**
 * 查找第一个 id 匹配 `targetId` 的节点。
 *
 * 遍历顺序为前序、从左到右；当存在重复 id 时，会返回树中第一个可见节点。
 * 匹配时按字符串值比较 id，以同时支持数字和字符串 id。
 *
 * @param tree 需要搜索的树根节点。
 * @param targetId 目标节点 id。
 * @param config 自定义 id 和子节点字段名。
 * @returns 匹配节点；未找到时返回 `null`。
 */
export function findNode<T>(
  tree: T[],
  targetId: string | number,
  config: TreeConfig<T> = {},
): T | null {
  const idKey = config.idKey ?? DEFAULT_ID_KEY
  const childrenKey = config.childrenKey ?? DEFAULT_CHILDREN_KEY
  const targetStr = String(targetId)
  const stack: T[] = []

  // Push in reverse to maintain left-to-right traversal
  for (let index = tree.length - 1; index >= 0; index--) {
    stack.push(tree[index])
  }

  while (stack.length > 0) {
    const node = stack.pop()!
    const id = getTreeValue(node, idKey)
    if (id === targetId || String(id) === targetStr) return node

    const children = getTreeChildren(node, childrenKey)
    if (children && children.length > 0) {
      for (let index = children.length - 1; index >= 0; index--) {
        stack.push(children[index])
      }
    }
  }

  return null
}

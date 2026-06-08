import type { TreeConfig } from './types'

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
export function findParent<T extends Record<string, unknown>>(
  tree: T[],
  targetId: string | number,
  config: TreeConfig<T> = {},
): T | null {
  const { idKey = 'id', childrenKey = 'children' } = config
  const targetStr = String(targetId)
  const nodeStack: T[] = []
  const parentStack: Array<T | null> = []

  for (let index = tree.length - 1; index >= 0; index--) {
    nodeStack.push(tree[index])
    parentStack.push(null)
  }

  while (nodeStack.length > 0) {
    const node = nodeStack.pop()!
    const parent = parentStack.pop()!
    const id = node[idKey]
    if (id === targetId || String(id) === targetStr) return parent

    const children = node[childrenKey]
    if (Array.isArray(children)) {
      for (let index = children.length - 1; index >= 0; index--) {
        nodeStack.push(children[index])
        parentStack.push(node)
      }
    }
  }

  return null
}

import type { TreeConfig } from './types'

/**
 * 返回某个目标节点的 所有祖先节点(从最近的父节点到根节点,顺序由下往上)
 * @param tree 树结构
 * @param targetId 目标节点id
 * @param config 树配置项
 * @returns 返回一个节点数组,包含了相关联的节点层级
 */
export function getParentNodes<T extends Record<string, any>>(
  tree: T[],
  targetId: string | number,
  config: TreeConfig<T> = {},
): T[] | [] {
  const { idKey = 'id', childrenKey = 'children' } = config
  const stack: { node: T; path: T[] }[] = []
  for (const rootNode of tree) {
    stack.push({ node: rootNode, path: [rootNode] })
  }
  while (stack.length > 0) {
    const { node, path } = stack.pop()!
    if (String(node[idKey]) === String(targetId)) {
      return path
    }
    if (node[childrenKey]) {
      for (const child of node[childrenKey] as T[]) {
        stack.push({ node: child, path: [...path, child] })
      }
    }
  }
  return []
}

import type { TreeConfig } from './types'

/**
 * 根据指定节点id获取该节点的父节点
 * @param tree 树结构
 * @param targetId 目标节点id
 * @param config 树配置
 * @returns 返回指定节点id获取顶层节点或null
 */
export function findParentNode<T extends Record<string, any>>(
  tree: T[],
  targetId: string | number,
  config: TreeConfig<T> = {},
): T | null {
  const { idKey = 'id', childrenKey = 'children' } = config
  const stack: { node: T; parent: T | null }[] = tree.map((node) => ({
    node,
    parent: null,
  }))
  while (stack.length) {
    const { node, parent } = stack.pop()!
    if (String(node[idKey]) === String(targetId)) {
      return parent
    }
    const children = node[childrenKey] as T[] | undefined
    if (children?.length) {
      for (const child of children) {
        stack.push({ node: child, parent: node })
      }
    }
  }
  return null
}

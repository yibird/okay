import type { TreeConfig } from './types'

/**
 * 在一棵树形结构中,查找指定 id 的节点,并返回该节点对象
 * @param tree 树结构
 * @param targetId 目标节点id
 * @param config 树配置项
 * @returns 返回指定id节点的顶层节点,如果没有找到则返回null
 */
export function findNodeById<T extends Record<string, any>>(
  tree: T[],
  targetId: string | number,
  config: TreeConfig<T> = {},
): T | null {
  const { idKey = 'id', childrenKey = 'children' } = config

  const stack: T[] = [...tree]
  while (stack.length > 0) {
    const node = stack.pop()!
    if (String(node[idKey]) === String(targetId)) {
      return node // 找到目标节点
    }
    if (node[childrenKey]) {
      stack.push(...(node[childrenKey] as T[]))
    }
  }
  return null
}

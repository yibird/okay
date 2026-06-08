import type { TreeConfig } from './types'

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
export function findPath<T extends Record<string, unknown>>(
  tree: T[],
  targetId: string | number,
  config: TreeConfig<T> = {},
): T[] {
  const { idKey = 'id', childrenKey = 'children' } = config
  const targetStr = String(targetId)
  const path: T[] = []

  const dfs = (nodes: T[]): boolean => {
    for (const node of nodes) {
      path.push(node)
      const id = node[idKey]
      if (id === targetId || String(id) === targetStr) return true
      const children = node[childrenKey]
      if (Array.isArray(children) && children.length > 0 && dfs(children)) return true
      path.pop()
    }
    return false
  }

  return dfs(tree) ? path : []
}

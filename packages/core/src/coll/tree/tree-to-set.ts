import { treeToList } from './tree-to-list'

/**
 * Tree转Set
 * @param tree 属性结构
 * @param childrenKey 子节点属性名,默认值为'children'
 * @returns 转换后的Set结构
 */
export function treeToSet<T extends Record<string, any>>(
  tree: T[],
  childrenKey = 'children',
): Set<T> {
  return new Set(treeToList(tree, childrenKey))
}

import { DEFAULT_CHILDREN_KEY, getTreeChildren } from './treeAccess'

/**
 * 返回从最后一个根节点到最后一枚可到达叶子节点的路径。
 *
 * 该方法会从根节点数组的最后一项开始，每一层都继续选择当前节点的最后一个子节点，
 * 直到遇到没有子节点的叶子节点。返回的数组是一条路径，数组项保持源树中的原始对象引用。
 *
 * @param tree 树的根节点数组。
 * @param childrenKey 存放子节点数组的字段名，默认读取 `children`。
 * @returns 最后一条根到叶子的路径；空树返回空数组。
 */
export function lastLeafPath<T>(tree: T[], childrenKey = DEFAULT_CHILDREN_KEY): T[] {
  if (tree.length === 0) return []

  const path: T[] = []
  let nodes: T[] | undefined = tree

  while (nodes && nodes.length > 0) {
    const node: T = nodes[nodes.length - 1]
    path.push(node)
    nodes = getTreeChildren(node, childrenKey)
  }

  return path
}

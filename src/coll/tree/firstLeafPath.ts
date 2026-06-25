import { DEFAULT_CHILDREN_KEY, getTreeChildren } from './treeAccess'

/**
 * 返回从第一个根节点到第一枚可到达叶子节点的路径。
 *
 * 该方法会从根节点数组的第一项开始，每一层都继续选择当前节点的第一个子节点，
 * 直到遇到没有子节点的叶子节点。返回的数组是一条路径，数组项保持源树中的原始对象引用。
 *
 * @param tree 树的根节点数组。
 * @param childrenKey 存放子节点数组的字段名，默认读取 `children`。
 * @returns 第一条根到叶子的路径；空树返回空数组。
 */
export function firstLeafPath<T>(tree: T[], childrenKey: string = DEFAULT_CHILDREN_KEY): T[] {
  if (tree.length === 0) return []

  const path: T[] = []
  let nodes = tree

  while (nodes.length > 0) {
    const node = nodes[0]
    path.push(node)

    const children = getTreeChildren(node, childrenKey)
    if (!children || children.length === 0) break
    nodes = children
  }

  return path
}

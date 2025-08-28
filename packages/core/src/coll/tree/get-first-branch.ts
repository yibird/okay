/**
 * 获取树的第一个分支
 * @param tree 树结构数组
 * @param childrenKey 子节点键名
 * @returns 返回树的第一个分支(分支组成的数组)
 */
export function getFirstBranch<T extends Record<string, any>>(
  tree: T[],
  childrenKey: string = 'children',
): T[] {
  const path: T[] = []
  let currentList = tree
  while (currentList && currentList.length > 0) {
    const firstNode = currentList[0]
    path.push(firstNode)
    currentList = firstNode[childrenKey] || []
  }
  return path
}

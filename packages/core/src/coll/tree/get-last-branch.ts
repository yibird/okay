/**
 * 获取树的最后一个分支
 * @param tree 树结构数组
 * @param childrenKey 子节点键名
 * @returns 返回树的最后一个分支(分支组成的数组)
 */
export function getLastBranch<T extends Record<string, any>>(
  tree: T[],
  childrenKey: string = 'children',
): T[] {
  const path: T[] = []
  let currentList = tree
  while (currentList && currentList.length > 0) {
    const lastNode = currentList.at(-1)
    path.push(lastNode)
    currentList = lastNode[childrenKey] || []
  }
  return path
}

/**
 * 将树按前序遍历顺序转换为节点数组。
 *
 * 返回的节点会保持源树中的原始对象引用。该方法只负责线性化遍历顺序，
 * 不会克隆节点，也不会移除节点上的子节点字段。
 *
 * @param tree 树的根节点数组。
 * @param childrenKey 存放子节点数组的字段名，默认读取 `children`。
 * @returns 按前序遍历顺序排列的所有节点。
 */
export function treeToList<T extends Record<string, unknown>>(
  tree: T[],
  childrenKey: string = 'children',
): T[] {
  if (!Array.isArray(tree) || tree.length === 0) return []

  const result: T[] = []
  const stack: T[] = []
  for (let i = tree.length - 1; i >= 0; i--) stack.push(tree[i])

  while (stack.length > 0) {
    const node = stack.pop() as T
    result.push(node)

    const children = node[childrenKey]
    if (Array.isArray(children)) {
      for (let index = children.length - 1; index >= 0; index--) {
        stack.push(children[index])
      }
    }
  }

  return result
}

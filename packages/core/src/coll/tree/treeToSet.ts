/**
 * 将树转换为由节点引用组成的 `Set`。
 *
 * 生成的 `Set` 会保留前序遍历的插入顺序。节点不会被克隆，
 * 因此集合中的对象身份与源树中的节点保持一致。
 *
 * @param tree 树的根节点数组。
 * @param childrenKey 存放子节点数组的字段名，默认读取 `children`。
 * @returns 包含树中每个节点引用的 `Set`。
 */
export function treeToSet<T extends Record<string, unknown>>(
  tree: T[],
  childrenKey = 'children',
): Set<T> {
  const result = new Set<T>()
  if (!Array.isArray(tree) || tree.length === 0) return result

  const stack: T[] = []
  for (let i = tree.length - 1; i >= 0; i--) stack.push(tree[i])

  while (stack.length > 0) {
    const node = stack.pop() as T
    result.add(node)

    const children = node[childrenKey]
    if (Array.isArray(children)) {
      for (let index = children.length - 1; index >= 0; index--) {
        stack.push(children[index])
      }
    }
  }

  return result
}

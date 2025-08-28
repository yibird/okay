/**
 * tree结构根据children属性扁平化为list,泛型T为节点类型
 * @param tree
 * @param childrenKey 子节点属性名,默认值为'children'
 * @returns 扁平化的list
 */
export function treeToList<T extends Record<string, any>>(
  tree: T[],
  childrenKey: string = 'children',
): T[] {
  if (!Array.isArray(tree) || tree.length === 0) return []

  const result: T[] = []
  // 使用栈做前序遍历：先 push 根节点（从右到左 push 子节点以保证从左到右遍历）
  const stack: T[] = [...tree].reverse() // 复制并反转以保证顺序

  while (stack.length) {
    const node = stack.pop() as T
    result.push(node)

    const children = node[childrenKey]
    if (Array.isArray(children) && children.length > 0) {
      // 为保证左到右遍历，需要先把 children 反转，然后依次 push 到栈
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i])
      }
    }
  }
  return result
}

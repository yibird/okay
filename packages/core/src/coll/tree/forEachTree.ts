export type TreeVisitOrder = 'pre' | 'post'

export interface ForEachTreeOptions {
  /**
   * 存放子节点数组的字段名，默认读取 `children`。
   */
  childrenKey?: string
  /**
   * 遍历顺序。
   *
   * `pre` 表示先访问节点自身再访问后代节点；`post` 表示先访问后代节点再访问节点自身。
   *
   * @default 'pre'
   */
  order?: TreeVisitOrder
}

type TreeVisitor<T> = (node: T, level: number, parent: T | null) => void

/**
 * 按前序或后序访问树中的每一个节点。
 *
 * 遍历过程使用显式栈实现，不依赖递归调用，因此面对较深的树结构时不会触发调用栈溢出。
 * visitor 会收到当前节点、从 0 开始的层级以及父节点；根节点的父节点为 `null`。
 *
 * @param tree 需要遍历的根节点数组。
 * @param visitor 每访问一个节点时调用的回调函数。
 * @param options 子节点字段名和遍历顺序配置。
 */
export function forEachTree<T extends Record<string, unknown>>(
  tree: T[],
  visitor: TreeVisitor<T>,
  options: ForEachTreeOptions = {},
): void {
  const { childrenKey = 'children', order = 'pre' } = options

  if (order === 'post') {
    type Frame = { node: T; level: number; parent: T | null; expanded: boolean }
    const stack: Frame[] = []

    for (let index = tree.length - 1; index >= 0; index--) {
      stack.push({ node: tree[index], level: 0, parent: null, expanded: false })
    }

    while (stack.length > 0) {
      const item = stack[stack.length - 1]

      if (item.expanded) {
        stack.pop()
        visitor(item.node, item.level, item.parent)
        continue
      }

      item.expanded = true

      const children = item.node[childrenKey]
      if (Array.isArray(children)) {
        for (let index = children.length - 1; index >= 0; index--) {
          stack.push({
            node: children[index],
            level: item.level + 1,
            parent: item.node,
            expanded: false,
          })
        }
      }
    }

    return
  }

  const nodeStack: T[] = []
  const levelStack: number[] = []
  const parentStack: Array<T | null> = []

  for (let index = tree.length - 1; index >= 0; index--) {
    nodeStack.push(tree[index])
    levelStack.push(0)
    parentStack.push(null)
  }

  while (nodeStack.length > 0) {
    const node = nodeStack.pop()!
    const level = levelStack.pop()!
    const parent = parentStack.pop()!
    visitor(node, level, parent)

    const children = node[childrenKey]
    if (Array.isArray(children)) {
      for (let index = children.length - 1; index >= 0; index--) {
        nodeStack.push(children[index])
        levelStack.push(level + 1)
        parentStack.push(node)
      }
    }
  }
}

import type { TreeMapConfig } from './types'

/**
 * 非递归地将一棵树映射为新树。
 *
 * 映射函数可返回 `null` 来过滤当前节点。被过滤节点的子节点会挂到最近的已映射祖先上，
 * 从而保留有用后代，而不是直接丢弃整棵子树。
 *
 * @param tree 源树根节点。
 * @param mapperFunc 对每个源节点调用一次的映射函数。
 * @param config 自定义子节点字段，默认 `children`。
 * @returns 映射后的树根节点。
 */
export function mapTree<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
  K extends keyof T = 'children',
>(tree: T[], mapperFunc: (item: T) => U | null, config: TreeMapConfig<T, K> = {}): U[] {
  const childrenKey = (config.childrenKey ?? ('children' as unknown)) as K
  const outputChildrenKey = childrenKey as unknown as string

  if (!Array.isArray(tree) || tree.length === 0) return []

  const result: U[] = []
  const nodeStack: T[] = []
  const parentStack: Array<U | null> = []

  for (let index = tree.length - 1; index >= 0; index--) {
    nodeStack.push(tree[index])
    parentStack.push(null)
  }

  while (nodeStack.length) {
    const node = nodeStack.pop()!
    const parentMapped = parentStack.pop()!
    const mapped = mapperFunc(node)
    let nextParent = parentMapped

    if (mapped) {
      // Directly assign children array rather than Object.assign to avoid mutating
      // other properties of mapped and to skip the intermediate object creation.
      ;(mapped as unknown as Record<string, unknown>)[outputChildrenKey] = []
      const mappedWithChildren = mapped as unknown as U & Record<string, unknown>

      if (parentMapped) {
        ;(parentMapped as unknown as Record<string, unknown[]>)[outputChildrenKey].push(
          mappedWithChildren,
        )
      } else {
        result.push(mappedWithChildren as unknown as U)
      }

      nextParent = mappedWithChildren as unknown as U
    }

    const children = node[childrenKey]
    if (Array.isArray(children) && children.length > 0) {
      for (let index = children.length - 1; index >= 0; index--) {
        nodeStack.push(children[index])
        parentStack.push(nextParent)
      }
    }
  }

  return result
}

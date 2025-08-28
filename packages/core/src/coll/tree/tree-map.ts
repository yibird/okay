import type { TreeMapConfig } from './types'

/**
 * 高性能、类型友好的 treeMap
 * @param tree 源树数组
 * @param mapperFunc 映射函数：接收 T，返回 U 或 null（null 表示过滤当前节点）
 * @param config 可选，childrenKey 指定子节点字段名（默认为 'children'）
 */
export function treeMap<
  T extends Record<string, any>,
  U extends Record<string, any>,
  K extends keyof T = 'children',
>(
  tree: T[],
  mapperFunc: (item: T) => U | null,
  config: TreeMapConfig<T, K> = {},
): U[] {
  const childrenKey = (config.childrenKey ?? ('children' as unknown)) as K

  if (!Array.isArray(tree) || tree.length === 0) return []

  type StackItem = {
    node: T
    parentMapped: U | null
  }

  const result: U[] = []
  const stack: StackItem[] = []

  // push roots in reverse so we pop in original order (left-to-right)
  for (let i = tree.length - 1; i >= 0; i--) {
    stack.push({ node: tree[i], parentMapped: null })
  }

  while (stack.length) {
    const { node, parentMapped } = stack.pop()!

    const mapped = mapperFunc(node)

    // currentParentMapped is the mapped ancestor to which children should attach
    let currentParentMapped: U | null = parentMapped

    if (mapped) {
      // Ensure mapped has children array for future attachments
      // We can't statically know U has childrenKey, so use a minimal assertion
      const ck = childrenKey as unknown as string
      if ((mapped as any)[ck] === undefined) {
        ;(mapped as any)[ck] = []
      }
      if (parentMapped) {
        ;(parentMapped as any)[ck].push(mapped)
      } else {
        result.push(mapped)
      }
      currentParentMapped = mapped
    } else {
      // mapped === null -> children inherit parentMapped
      currentParentMapped = parentMapped
    }

    const children = node[childrenKey]
    if (Array.isArray(children) && children.length > 0) {
      // push children in reverse order to process them left-to-right
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push({ node: children[i], parentMapped: currentParentMapped })
      }
    }
  }

  return result
}

import { cloneTreeNode, getTreeChildren, getTreeValue } from '../tree/treeAccess'

/**
 * 从扁平列表构建树时使用的字段名配置。
 */
export interface ListToTreeOptions<T, ChildrenKey extends PropertyKey = 'children'> {
  /**
   * 每一项的唯一标识字段。
   */
  idKey?: keyof T
  /**
   * 返回树中用于接收子节点的字段。
   */
  childrenKey?: ChildrenKey
  /**
   * 每一项的父节点标识字段。
   */
  parentIdKey?: keyof T
  /**
   * 标记根节点的父级值。
   */
  rootParentValue?: unknown
}

/**
 * 将带父级标识的扁平列表转换为树。
 *
 * 返回节点是源节点的浅拷贝，并会在 `childrenKey` 下始终放置子节点数组。
 * 找不到父节点的项会提升为根节点，避免数据丢失。
 *
 * @param list 扁平节点列表。
 * @param config 自定义标识、父级、子级和根节点标记字段。
 * @returns 从输入列表构建出的树根节点。
 */
export function listToTree<T, ChildrenKey extends PropertyKey = 'children'>(
  array: readonly T[],
  config: ListToTreeOptions<T, ChildrenKey> = {},
): T[] {
  const {
    idKey = 'id' as keyof T,
    childrenKey = 'children' as ChildrenKey,
    parentIdKey = 'parentId' as keyof T,
    rootParentValue = null,
  } = config
  const nodeMap = new Map<unknown, T>()
  const sourceMap = new Map<unknown, T>()

  for (const node of array) {
    const id = getTreeValue(node, idKey as PropertyKey)

    if (id === undefined || id === null) {
      throw new TypeError('listToTree requires every node to have a non-null id')
    }

    if (nodeMap.has(id)) {
      throw new TypeError(`listToTree does not allow duplicate node ids: ${String(id)}`)
    }

    sourceMap.set(id, node)
    nodeMap.set(id, cloneTreeNode(node, childrenKey))
  }

  // Detect cycles in O(n) total: walk each node's parent chain, marking visited nodes.
  // If we reach an already-in-progress node we have a cycle; if done, skip.
  const state = new Map<unknown, 'in-progress' | 'done'>()
  for (const node of array) {
    let id = getTreeValue(node, idKey as PropertyKey)
    if (state.get(id) === 'done') continue
    const chain = new Set<unknown>()
    while (id !== undefined && id !== rootParentValue && nodeMap.has(id)) {
      if (state.get(id) === 'done') break
      if (chain.has(id)) {
        throw new TypeError(`listToTree detected a parent cycle for node id: ${String(id)}`)
      }
      state.set(id, 'in-progress')
      chain.add(id)
      id = getTreeValue(sourceMap.get(id), parentIdKey as PropertyKey)
    }
    for (const visited of chain) state.set(visited, 'done')
  }

  const tree: T[] = []
  for (const node of array) {
    const id = getTreeValue(node, idKey as PropertyKey)
    const parentId = getTreeValue(node, parentIdKey as PropertyKey)
    const isRoot = parentId === rootParentValue
    const currentNode = nodeMap.get(id)
    // v8 ignore next 2 - unreachable: all ids are validated and added to nodeMap above
    if (!currentNode) continue

    if (isRoot) {
      tree.push(currentNode)
      continue
    }

    const parent = nodeMap.get(parentId)
    if (parent) {
      getTreeChildren(parent, childrenKey)?.push(currentNode)
    } else {
      tree.push(currentNode)
    }
  }

  return tree
}

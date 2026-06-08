interface TreeNode {
  [key: string]: unknown
  children?: TreeNode[]
}

/**
 * 从扁平列表构建树时使用的字段名配置。
 */
interface TreeConfig<T extends TreeNode = TreeNode> {
  /**
   * 每一项的唯一标识字段。
   */
  idKey?: keyof T
  /**
   * 返回树中用于接收子节点的字段。
   */
  childrenKey?: keyof T
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
export function listToTree<T extends TreeNode>(array: T[], config: TreeConfig<T> = {}): T[] {
  const {
    idKey = 'id' as keyof T,
    childrenKey = 'children' as keyof T,
    parentIdKey = 'parentId' as keyof T,
    rootParentValue = null,
  } = config
  const nodeMap = new Map<unknown, T & Record<string, any>>()
  const sourceMap = new Map<unknown, T>()

  for (const node of array) {
    const id = node[idKey]

    if (id === undefined || id === null) {
      throw new TypeError('listToTree requires every node to have a non-null id')
    }

    if (nodeMap.has(id)) {
      throw new TypeError(`listToTree does not allow duplicate node ids: ${String(id)}`)
    }

    sourceMap.set(id, node)
    nodeMap.set(id, {
      ...(node as any),
      [childrenKey]: [],
    })
  }

  // Detect cycles in O(n) total: walk each node's parent chain, marking visited nodes.
  // If we reach an already-in-progress node we have a cycle; if done, skip.
  const state = new Map<unknown, 'in-progress' | 'done'>()
  for (const node of array) {
    let id: unknown = node[idKey]
    if (state.get(id) === 'done') continue
    const chain = new Set<unknown>()
    while (id !== undefined && id !== rootParentValue && nodeMap.has(id)) {
      if (state.get(id) === 'done') break
      if (chain.has(id)) {
        throw new TypeError(`listToTree detected a parent cycle for node id: ${String(id)}`)
      }
      state.set(id, 'in-progress')
      chain.add(id)
      id = sourceMap.get(id)?.[parentIdKey]
    }
    for (const visited of chain) state.set(visited, 'done')
  }

  const tree: Array<T & Record<string, any>> = []
  for (const node of array) {
    const id = node[idKey]
    const parentId = node[parentIdKey]
    const isRoot = parentId === rootParentValue
    const currentNode = nodeMap.get(id) as T & Record<string, any>
    if (isRoot) {
      tree.push(currentNode)
      continue
    }
    const parent = nodeMap.get(parentId)
    if (parent) {
      parent[childrenKey].push(currentNode)
    } else {
      tree.push(currentNode)
    }
  }
  return tree as T[]
}

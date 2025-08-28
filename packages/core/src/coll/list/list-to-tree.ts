export interface TreeNode {
  [key: string]: any
  children?: TreeNode[]
}

export interface TreeConfig<T extends TreeNode = TreeNode> {
  idKey?: keyof T
  childrenKey?: keyof T
  parentIdKey?: keyof T
  rootParentValue?: any
}

export function listToTree<T extends TreeNode>(
  list: T[],
  config: TreeConfig<T> = {},
) {
  const {
    idKey = 'id' as keyof T,
    childrenKey = 'children' as keyof T,
    parentIdKey = 'parentId' as keyof T,
    rootParentValue = null,
  } = config

  // 创建节点映射（使用克隆节点，保证每个节点都有 children 字段）
  const nodeMap = new Map<any, T & Record<string, any>>()
  list.forEach((node) => {
    // shallow clone 原始 node，并保证 children 字段存在（不可共享）
    const cloned: T & Record<string, any> = {
      ...(node as any),
      [childrenKey]: [] as T[],
    }
    nodeMap.set((node as any)[idKey], cloned)
  })

  const tree: (T & Record<string, any>)[] = []

  list.forEach((node) => {
    const parentId = (node as any)[parentIdKey]

    // 明确判断根节点：parentId === rootParentValue 或 null/undefined
    const isRoot =
      parentId === rootParentValue ||
      parentId === null ||
      parentId === undefined

    const thisNode = nodeMap.get((node as any)[idKey]) as T &
      Record<string, any>

    if (isRoot) {
      tree.push(thisNode)
    } else {
      const parent = nodeMap.get(parentId)
      if (parent) {
        // 使用克隆的 child（thisNode）
        parent[childrenKey].push(thisNode)
      } else {
        // 找不到父节点，作为根节点处理（使用克隆版本）
        tree.push(thisNode)
      }
    }
  })

  return tree as T[]
}

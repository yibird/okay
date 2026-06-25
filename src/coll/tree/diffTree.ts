import {
  countOwnEnumerableKeys,
  deepEqual,
  isObjectLike,
  ownEnumerableKeys,
  propertyIsEnumerable,
} from '../../internal/deepEqual'
import { DEFAULT_CHILDREN_KEY, DEFAULT_ID_KEY, getTreeChildren } from './treeAccess'

/**
 * 树节点差异比较支持的唯一标识类型。
 */
export type TreeDiffId = PropertyKey

/**
 * 树节点唯一标识选择器，可以是字段名或函数。
 */
export type TreeDiffSelector<T, Id extends TreeDiffId> = keyof T | ((node: T) => Id)

/**
 * `diffTree` 的差异比较配置。
 */
export interface DiffTreeOptions<T, Id extends TreeDiffId, ChildrenKey extends keyof T> {
  /**
   * 节点唯一标识字段或选择器。
   */
  idKey?: TreeDiffSelector<T, Id>
  /**
   * 子节点字段名。
   */
  childrenKey?: ChildrenKey
  /**
   * 自定义节点内容比较函数。
   *
   * 返回 `true` 表示两个节点内容相同；路径变化仍会被识别为更新。
   */
  isEqual?: (oldNode: T, newNode: T) => boolean
}

/**
 * 树差异中的新增节点。
 */
export interface TreeDiffAdded<T, Id extends TreeDiffId> {
  /**
   * 新增节点标识。
   */
  id: Id
  /**
   * 新增节点在新树中的路径。
   */
  path: Id[]
  /**
   * 新增节点引用。
   */
  node: T
}

/**
 * 树差异中的更新节点。
 */
export interface TreeDiffUpdated<T, Id extends TreeDiffId> {
  /**
   * 更新节点标识。
   */
  id: Id
  /**
   * 更新节点在新树中的路径。
   */
  path: Id[]
  /**
   * 更新节点在旧树中的路径。
   */
  oldPath: Id[]
  /**
   * 旧节点引用。
   */
  oldNode: T
  /**
   * 新节点引用。
   */
  newNode: T
  /**
   * 节点内容是否发生变化。
   */
  valueChanged: boolean
  /**
   * 节点路径是否发生变化。
   */
  pathChanged: boolean
}

/**
 * 树差异中的删除节点。
 */
export interface TreeDiffRemoved<T, Id extends TreeDiffId> {
  /**
   * 删除节点标识。
   */
  id: Id
  /**
   * 删除节点在旧树中的路径。
   */
  path: Id[]
  /**
   * 删除节点引用。
   */
  node: T
}

/**
 * 树差异比较结果。
 */
export interface TreeDiffResult<T, Id extends TreeDiffId> {
  /**
   * 新增节点列表。
   */
  added: Array<TreeDiffAdded<T, Id>>
  /**
   * 更新节点列表。
   */
  updated: Array<TreeDiffUpdated<T, Id>>
  /**
   * 删除节点列表。
   */
  removed: Array<TreeDiffRemoved<T, Id>>
}

interface IndexedTreeNode<T, Id extends TreeDiffId> {
  id: Id
  path: Id[]
  node: T
}

const createSelector = <T, Id extends TreeDiffId>(selector: TreeDiffSelector<T, Id>) =>
  typeof selector === 'function' ? selector : (node: T) => node[selector] as Id

const defaultNodeEqual = <T, ChildrenKey extends keyof T>(
  oldNode: T,
  newNode: T,
  childrenKey: ChildrenKey,
) => {
  // v8 ignore next 1 - defensive: nodes are always objects from tree traversal
  if (!isObjectLike(oldNode) || !isObjectLike(newNode)) return deepEqual(oldNode, newNode)

  const oldKeys = ownEnumerableKeys(oldNode)
  let oldKeyCount = 0

  for (let i = 0; i < oldKeys.length; i++) {
    const key = oldKeys[i]
    if (key === childrenKey) continue
    oldKeyCount++

    if (!propertyIsEnumerable.call(newNode, key) || !deepEqual(oldNode[key], newNode[key])) {
      return false
    }
  }

  return oldKeyCount === countOwnEnumerableKeys(newNode, childrenKey)
}

const isSamePath = <Id extends TreeDiffId>(left: readonly Id[], right: readonly Id[]) => {
  if (left.length !== right.length) return false

  for (let index = 0; index < left.length; index++) {
    if (left[index] !== right[index]) {
      return false
    }
  }

  return true
}

const indexTree = <T, Id extends TreeDiffId, ChildrenKey extends keyof T>(
  tree: readonly T[],
  getId: (node: T) => Id,
  childrenKey: ChildrenKey,
) => {
  const result = new Map<Id, IndexedTreeNode<T, Id>>()

  // Use an explicit stack with parent-path references to avoid O(depth) spread per node.
  // parentPath is shared and never mutated after being stored.
  type StackFrame = { node: T; parentPath: Id[] }
  const stack: StackFrame[] = []

  for (let index = tree.length - 1; index >= 0; index--) {
    stack.push({ node: tree[index], parentPath: [] })
  }

  while (stack.length > 0) {
    const { node, parentPath } = stack.pop()!
    const id = getId(node)

    if (result.has(id)) {
      throw new TypeError(`diffTree 不允许重复节点标识：${String(id)}`)
    }

    // Build the path array once per node and reuse it as the parent path for children.
    const path = parentPath.length === 0 ? [id] : [...parentPath, id]
    result.set(id, { id, node, path })

    const children = getTreeChildren(node, childrenKey)
    if (!children) continue

    for (let index = children.length - 1; index >= 0; index--) {
      stack.push({ node: children[index], parentPath: path })
    }
  }

  return result
}

/**
 * 对比两棵树并返回新增、更新、删除的精确节点报告。
 *
 * 默认使用 `id` 作为唯一标识、`children` 作为子节点字段。节点内容比较会忽略子节点字段，
 * 避免整棵子树变化导致父节点被误判；如果同一个节点路径变化，也会进入 `updated`。
 *
 * @param oldTree 旧树。
 * @param newTree 新树。
 * @param options 唯一标识、子节点字段和自定义比较函数。
 * @returns 新增、更新、删除节点报告。
 */
export function diffTree<
  T,
  Id extends TreeDiffId = TreeDiffId,
  ChildrenKey extends keyof T = 'children' extends keyof T ? 'children' : keyof T,
>(
  oldTree: readonly T[],
  newTree: readonly T[],
  options: DiffTreeOptions<T, Id, ChildrenKey> = {},
): TreeDiffResult<T, Id> {
  const idKey = options.idKey ?? (DEFAULT_ID_KEY as unknown as TreeDiffSelector<T, Id>)
  const childrenKey = options.childrenKey ?? (DEFAULT_CHILDREN_KEY as unknown as ChildrenKey)
  const getId = createSelector(idKey)
  const oldIndex = indexTree(oldTree, getId, childrenKey)
  const newIndex = indexTree(newTree, getId, childrenKey)
  const isEqual =
    options.isEqual ?? ((oldNode: T, newNode: T) => defaultNodeEqual(oldNode, newNode, childrenKey))
  const added: Array<TreeDiffAdded<T, Id>> = []
  const updated: Array<TreeDiffUpdated<T, Id>> = []
  const removed: Array<TreeDiffRemoved<T, Id>> = []

  for (const current of newIndex.values()) {
    const previous = oldIndex.get(current.id)

    if (!previous) {
      added.push({
        id: current.id,
        node: current.node,
        path: current.path,
      })
      continue
    }

    const valueChanged = !isEqual(previous.node, current.node)
    const pathChanged = !isSamePath(previous.path, current.path)

    if (valueChanged || pathChanged) {
      updated.push({
        id: current.id,
        newNode: current.node,
        oldNode: previous.node,
        oldPath: previous.path,
        path: current.path,
        pathChanged,
        valueChanged,
      })
    }
  }

  for (const current of oldIndex.values()) {
    if (!newIndex.has(current.id)) {
      removed.push({
        id: current.id,
        node: current.node,
        path: current.path,
      })
    }
  }

  return {
    added,
    removed,
    updated,
  }
}

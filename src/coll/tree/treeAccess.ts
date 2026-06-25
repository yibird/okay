export const DEFAULT_ID_KEY = 'id'

export const DEFAULT_CHILDREN_KEY = 'children'

export function getTreeValue(node: unknown, key: PropertyKey): unknown {
  if (node === null || typeof node !== 'object') return undefined
  return (node as Record<PropertyKey, unknown>)[key]
}

export function getTreeChildren<T>(node: T, key: PropertyKey): T[] | undefined {
  const children = getTreeValue(node, key)
  return Array.isArray(children) ? children : undefined
}

export function cloneTreeNode<T>(node: T, childrenKey: PropertyKey): T {
  if (node === null || (typeof node !== 'object' && typeof node !== 'function')) {
    throw new TypeError('tree node must be an object-like value')
  }

  return Object.assign({}, node, { [childrenKey]: [] }) as T
}

export function setTreeChildren(node: unknown, key: PropertyKey, children: unknown[]): void {
  if (node === null || (typeof node !== 'object' && typeof node !== 'function')) {
    throw new TypeError('tree node must be an object-like value')
  }

  ;(node as Record<PropertyKey, unknown>)[key] = children
}

import { describe, expect, expectTypeOf, test } from 'vitest'
import { findNode } from './findNode'

describe('findNode', () => {
  const tree = [
    {
      id: 1,
      name: 'Root 1',
      children: [
        {
          id: 2,
          name: 'Child 1',
          children: [{ id: 3, name: 'Grandchild 1' }],
        },
        { id: 4, name: 'Child 2' },
      ],
    },
    { id: 5, name: 'Root 2' },
  ]

  test('should find node by id in tree', () => {
    const node = findNode(tree, 3)
    expect(node).not.toBeNull()
    expect(node?.id).toBe(3)
    expect(node?.name).toBe('Grandchild 1')
  })

  test('should return null if node not found', () => {
    const node = findNode(tree, 999)
    expect(node).toBeNull()
  })

  test('should find root node', () => {
    const node = findNode(tree, 1)
    expect(node?.id).toBe(1)
    expect(node?.name).toBe('Root 1')
  })

  test('should handle custom id key', () => {
    const customTree = [
      {
        key: 1,
        name: 'Root',
        children: [{ key: 2, name: 'Child' }],
      },
    ]
    const node = findNode(customTree, 2, { idKey: 'key' })
    expect(node?.key).toBe(2)
  })

  test('should handle empty tree', () => {
    const node = findNode([], 1)
    expect(node).toBeNull()
  })

  test('should accept interface nodes without index signature', () => {
    interface MenuItem {
      id: string
      title: string
      children?: MenuItem[]
    }

    const menu: MenuItem[] = [
      {
        id: 'dashboard',
        title: 'Dashboard',
        children: [{ id: 'fileManager', title: 'File Manager' }],
      },
    ]

    const node = findNode(menu, 'fileManager')

    expectTypeOf(node).toEqualTypeOf<MenuItem | null>()
    expect(node?.title).toBe('File Manager')
  })
})
